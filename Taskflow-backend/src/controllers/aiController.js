import { generateAiText, getAiErrorMessage } from "../services/aiService.js"
import Task from "../models/Task.js"
import {
  createActivity,
  getUpdateActivities,
  prepareTaskPayload,
} from "./taskController.js"

const APP_TIME_ZONE = process.env.APP_TIME_ZONE || "Asia/Kolkata"

const TASK_PARSE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    priority: { type: "string", enum: ["Low", "Medium", "High"] },
    dueDate: { type: ["string", "null"] },
    reminderAt: { type: ["string", "null"] },
    category: {
      type: "string",
      enum: ["Work", "Personal", "Study", "Urgent", "Health", "Meetings"],
    },
    recurrence: {
      type: "string",
      enum: ["None", "Daily", "Weekly", "Monthly"],
    },
    tags: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "title",
    "description",
    "priority",
    "dueDate",
    "reminderAt",
    "category",
    "recurrence",
    "tags",
  ],
  additionalProperties: false,
}

const ASSISTANT_ACTION_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    actions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["create_task", "update_task", "delete_task", "none"],
          },
          taskId: { type: ["string", "null"] },
          matchTitle: { type: ["string", "null"] },
          fields: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              status: {
                type: "string",
                enum: ["Pending", "In Progress", "Completed"],
              },
              priority: { type: "string", enum: ["Low", "Medium", "High"] },
              dueDate: { type: ["string", "null"] },
              reminderDate: { type: ["string", "null"] },
              reminderTime: { type: "string" },
              category: { type: "string" },
              recurringType: {
                type: "string",
                enum: ["None", "Daily", "Weekly", "Monthly"],
              },
              tags: {
                type: "array",
                items: { type: "string" },
              },
            },
            additionalProperties: false,
          },
        },
        required: ["type", "taskId", "matchTitle", "fields"],
        additionalProperties: false,
      },
    },
  },
  required: ["reply", "actions"],
  additionalProperties: false,
}

const extractJsonObject = (value) => {
  const clean = value.replace(/```json|```/g, "").trim()
  const start = clean.indexOf("{")
  const end = clean.lastIndexOf("}")

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not contain a JSON object")
  }

  return JSON.parse(clean.slice(start, end + 1))
}

const getCurrentDate = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  )

  return `${values.year}-${values.month}-${values.day}`
}

const addDays = (date, days) => {
  const [year, month, day] = date.split("-").map(Number)
  const nextDate = new Date(Date.UTC(year, month - 1, day))
  nextDate.setUTCDate(nextDate.getUTCDate() + days)
  return nextDate.toISOString().slice(0, 10)
}

const getRelativeDate = (value, today, tomorrow, nextWeek) => {
  if (value === "today") return today
  if (value === "tomorrow") return tomorrow
  if (value === "next week") return nextWeek
  return null
}

const findRelativeDateHint = (value, prefixes) => {
  for (const prefix of prefixes) {
    for (const dateWord of ["today", "tomorrow", "next week"]) {
      if (value.includes(`${prefix} ${dateWord}`)) {
        return dateWord
      }
    }
  }

  return null
}

const applyRelativeDateHints = (task, text, dates) => {
  const normalizedText = text.toLowerCase()
  const dueHint = findRelativeDateHint(normalizedText, [
    "due",
    "deadline",
    "deadline is",
    "by",
  ])
  const reminderHint = findRelativeDateHint(normalizedText, [
    "remind me",
    "reminder",
    "remind",
  ])

  const dueDate = getRelativeDate(
    dueHint,
    dates.today,
    dates.tomorrow,
    dates.nextWeek
  )
  const reminderDate = getRelativeDate(
    reminderHint,
    dates.today,
    dates.tomorrow,
    dates.nextWeek
  )

  if (dueDate) {
    task.dueDate = dueDate
  }

  if (reminderDate) {
    const reminderTime =
      typeof task.reminderAt === "string" && task.reminderAt.includes("T")
        ? task.reminderAt.split("T")[1] || "09:00"
        : "09:00"

    task.reminderAt = `${reminderDate}T${reminderTime.slice(0, 5)}`
  }

  return task
}

const serializeTaskForAssistant = (task) => ({
  id: String(task._id),
  title: task.title,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : null,
  reminderDate: task.reminderDate
    ? task.reminderDate.toISOString().slice(0, 16)
    : null,
  reminderTime: task.reminderTime || "",
  recurringType: task.recurringType,
  category: task.category,
  tags: Array.isArray(task.tags) ? task.tags : [],
  description:
    typeof task.description === "string" ? task.description.slice(0, 180) : "",
})

const normalizeActionFields = (fields = {}) => {
  const allowedFields = [
    "title",
    "description",
    "status",
    "priority",
    "dueDate",
    "reminderDate",
    "reminderTime",
    "category",
    "recurringType",
    "tags",
  ]

  return allowedFields.reduce((payload, field) => {
    if (Object.prototype.hasOwnProperty.call(fields, field)) {
      payload[field] = fields[field]
    }

    return payload
  }, {})
}

const findTaskForAction = (tasks, action) => {
  if (action.taskId) {
    const byId = tasks.find((task) => String(task._id) === action.taskId)

    if (byId) {
      return byId
    }
  }

  if (!action.matchTitle) {
    return null
  }

  const normalizedTitle = action.matchTitle.trim().toLowerCase()

  return (
    tasks.find((task) => task.title.toLowerCase() === normalizedTitle) ||
    tasks.find((task) => task.title.toLowerCase().includes(normalizedTitle))
  )
}

const executeAssistantActions = async (actions, tasks, userId) => {
  const results = []

  for (const action of actions) {
    if (!action || action.type === "none") {
      continue
    }

    if (action.type === "create_task") {
      const payload = prepareTaskPayload(normalizeActionFields(action.fields))

      if (!payload.title) {
        results.push({ type: action.type, success: false })
        continue
      }

      const task = await Task.create({
        status: "Pending",
        priority: "Medium",
        recurringType: "None",
        ...payload,
        activities: [createActivity("created", "Task created by AI assistant")],
        user: userId,
      })

      tasks.push(task)
      results.push({ type: action.type, success: true, task })
      continue
    }

    const task = findTaskForAction(tasks, action)

    if (!task) {
      results.push({ type: action.type, success: false })
      continue
    }

    if (action.type === "delete_task") {
      await Task.deleteOne({ _id: task._id, user: userId })
      results.push({ type: action.type, success: true, task })
      continue
    }

    if (action.type === "update_task") {
      const payload = prepareTaskPayload(normalizeActionFields(action.fields), task)
      const activities = getUpdateActivities(task, payload)
      const update =
        activities.length > 0
          ? {
              $set: payload,
              $push: {
                activities: {
                  $each: activities,
                },
              },
            }
          : {
              $set: payload,
            }

      const updatedTask = await Task.findOneAndUpdate(
        {
          _id: task._id,
          user: userId,
        },
        update,
        {
          returnDocument: "after",
        }
      )

      const taskIndex = tasks.findIndex(
        (item) => String(item._id) === String(task._id)
      )

      if (taskIndex >= 0 && updatedTask) {
        tasks[taskIndex] = updatedTask
      }

      results.push({ type: action.type, success: Boolean(updatedTask), task })
    }
  }

  return results
}

export const parseTask = async (req, res) => {
  try {
    const { text } = req.body
    if (!text) return res.status(400).json({ message: "text is required" })

    const today = getCurrentDate()
    const tomorrow = addDays(today, 1)
    const nextWeek = addDays(today, 7)

    const prompt = `You are a task parser.
Date reference:
- today: ${today}
- tomorrow: ${tomorrow}
- next week: ${nextWeek}

Extract task details from this input: "${text}"
Return ONLY a raw JSON object with NO markdown, NO code fences, NO explanation. Just the JSON object.
Fields:
- title: string (required). Keep it short and remove scheduling, priority, category, and tag words that are captured in other fields.
- description: string. Include clear context, outcome, important notes, and any requirements mentioned by the user. Use one concise paragraph.
- priority: exactly one of "Low", "Medium", "High"
- dueDate: ISO date string like "2026-06-15" or null. Interpret relative dates like today, tomorrow, and next week from today's date.
- reminderAt: ISO local datetime string like "2026-06-15T09:00" or null. Interpret reminder relative dates from today's date independently. If the user says "remind me tomorrow at 9:30 AM", use tomorrow's date with 09:30. If they give a reminder time without a reminder date, use the due date when available, otherwise today's date. If they ask for a reminder date without a time, use 09:00.
- category: exactly one of "Work", "Personal", "Study", "Urgent", "Health", "Meetings" - pick the closest match
- recurrence: exactly one of "None", "Daily", "Weekly", "Monthly". Use "None" when no repeat schedule is requested.
- tags: array of strings (can be empty array)`

    const raw = await generateAiText(prompt, {
      maxOutputTokens: 800,
      responseJsonSchema: TASK_PARSE_SCHEMA,
      responseMimeType: "application/json",
      thinkingBudget: 0,
      temperature: 0,
    })
    const parsed = applyRelativeDateHints(extractJsonObject(raw), text, {
      today,
      tomorrow,
      nextWeek,
    })
    res.json(parsed)
  } catch (error) {
    console.error("AI parse-task failed:", error.message)
    res.status(500).json({
      message: getAiErrorMessage(
        error,
        "AI could not parse this task right now."
      ),
    })
  }
}

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body
    if (!message) return res.status(400).json({ message: "message is required" })

    const userTasks = await Task.find({
      user: req.user._id,
    })

    const taskSummary = JSON.stringify(userTasks.map(serializeTaskForAssistant))
    const today = getCurrentDate()
    const tomorrow = addDays(today, 1)
    const nextWeek = addDays(today, 7)

    const prompt = `You are an AI assistant inside TaskFlow.
Date reference:
- today: ${today}
- tomorrow: ${tomorrow}
- next week: ${nextWeek}

Current tasks as JSON: ${taskSummary}

User message: "${message}"

Decide whether to change tasks or only answer.
You can:
- create_task with fields for a new task
- update_task to edit title, description, status, priority, category, dueDate, reminderDate, reminderTime, recurringType, or tags
- delete_task when the user clearly asks to remove/delete a task
- none for advice, summaries, questions, or unclear requests

Rules:
- For update_task or delete_task, use taskId from Current tasks when you can identify exactly one task. If not exact, set taskId null and matchTitle to the closest title.
- Map "pending", "todo", or "not started" to status "Pending".
- Map "in progress", "started", or "working on it" to status "In Progress".
- Map "done", "complete", "completed", or "finished" to status "Completed".
- Interpret relative dates using the Date reference.
- Use ISO date strings for dueDate like "${today}".
- Use local datetime strings for reminderDate like "${today}T09:00".
- If a request is ambiguous, do not modify tasks; ask a short clarifying question in reply.
- Reply in 1 short sentence and mention completed changes.`

    const raw = await generateAiText(prompt, {
      maxOutputTokens: 1000,
      responseJsonSchema: ASSISTANT_ACTION_SCHEMA,
      responseMimeType: "application/json",
      thinkingBudget: 0,
      temperature: 0.3,
    })
    const parsed = extractJsonObject(raw)
    const actions = Array.isArray(parsed.actions) ? parsed.actions : []
    const results = await executeAssistantActions(actions, userTasks, req.user._id)
    const tasksChanged = results.some((result) => result.success)

    res.json({
      reply: parsed.reply || "Done.",
      tasksChanged,
      actions: results.map((result) => ({
        type: result.type,
        success: result.success,
        taskId: result.task?._id,
        title: result.task?.title,
      })),
    })
  } catch (error) {
    console.error("AI chat failed:", error.message)
    res.status(500).json({
      message: getAiErrorMessage(error, "AI chat is unavailable right now."),
    })
  }
}
