import Task from "../models/Task.js"

export const createActivity = (type, message) => ({
  id:
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${type}-${Math.random().toString(16).slice(2)}`,
  type,
  message,
  at: new Date(),
})

const readableFieldNames = {
  title: "title",
  description: "description",
  status: "status",
  priority: "priority",
  category: "category",
  dueDate: "due date",
  reminderDate: "reminder",
  recurringType: "recurrence",
  tags: "tags",
}

const normalizeComparableValue = (value, field) => {
  if (value instanceof Date) {
    return field === "dueDate"
      ? value.toISOString().slice(0, 10)
      : value.toISOString().slice(0, 16)
  }

  if (Array.isArray(value)) {
    return JSON.stringify([...value].sort())
  }

  if (value === undefined || value === null) {
    return ""
  }

  const stringValue = String(value)

  if (field === "dueDate") {
    return stringValue.slice(0, 10)
  }

  if (field === "reminderDate") {
    return stringValue.slice(0, 16)
  }

  return stringValue
}

const logReminderSchedule = (task, action) => {
  if (!task?.reminderDate) {
    return
  }

  const reminderDate = new Date(task.reminderDate)

  console.log(
    `Reminder ${action} for task ${task._id}: ${reminderDate.toISOString()}`
  )
}

export const getUpdateActivities = (task, payload) => {
  const changedFields = Object.keys(readableFieldNames).filter((field) => {
    if (!Object.prototype.hasOwnProperty.call(payload, field)) {
      return false
    }

    return (
      normalizeComparableValue(task[field], field) !==
      normalizeComparableValue(payload[field], field)
    )
  })

  if (changedFields.length === 0) {
    return []
  }

  if (
    changedFields.length === 1 &&
    changedFields[0] === "status"
  ) {
    return [
      createActivity(
        "status",
        `Status changed to ${payload.status}`
      ),
    ]
  }

  const fieldList = changedFields
    .map((field) => readableFieldNames[field])
    .join(", ")

  return [
    createActivity(
      "updated",
      `Updated ${fieldList}`
    ),
  ]
}

export const prepareTaskPayload = (
  payload,
  existingTask = null
) => {
  const taskPayload = {
    ...payload,
  }

  delete taskPayload.user
  delete taskPayload.reminderSent
  delete taskPayload.activities

  if (
    Object.prototype.hasOwnProperty.call(
      taskPayload,
      "reminderAt"
    ) &&
    !Object.prototype.hasOwnProperty.call(
      taskPayload,
      "reminderDate"
    )
  ) {
    taskPayload.reminderDate =
      taskPayload.reminderAt
  }

  if (
    Object.prototype.hasOwnProperty.call(
      taskPayload,
      "recurrence"
    ) &&
    !Object.prototype.hasOwnProperty.call(
      taskPayload,
      "recurringType"
    )
  ) {
    taskPayload.recurringType =
      taskPayload.recurrence
  }

  delete taskPayload.reminderAt
  delete taskPayload.recurrence

  if (
    Object.prototype.hasOwnProperty.call(
      taskPayload,
      "reminderDate"
    )
  ) {
    const nextReminderDate =
      taskPayload.reminderDate || null

    taskPayload.reminderDate =
      nextReminderDate

    taskPayload.reminderTime =
      taskPayload.reminderTime ||
      (
        typeof nextReminderDate === "string" &&
        nextReminderDate.includes("T")
          ? nextReminderDate
              .split("T")[1]
              .slice(0, 5)
          : ""
      )

    if (
      !existingTask ||
      String(existingTask.reminderDate || "") !==
        String(nextReminderDate || "")
    ) {
      taskPayload.reminderSent = false
    }
  }

  return taskPayload
}

export const createTask =
  async (req, res) => {

    try {
      const payload =
        prepareTaskPayload(req.body)

      const task =
        await Task.create({
          ...payload,
          activities: [
            createActivity(
              "created",
              "Task created"
            ),
          ],
          user: req.user._id,
    })

      logReminderSchedule(task, "scheduled")

      res.status(201).json(task)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
}

export const getTasks =
  async (req, res) => {

    try {

      const tasks =
        await Task.find({
          user: req.user._id,
        })

      res.json(tasks)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
}

export const updateTask =
  async (req, res) => {

    try {

      const task =
        await Task.findOne({

          _id: req.params.id,

          user: req.user._id,
        })

      if (!task) {

        return res
          .status(404)
          .json({
            message:
              "Task not found",
          })
      }

      const payload =
        prepareTaskPayload(
          req.body,
          task
        )

      const activities =
        getUpdateActivities(
          task,
          payload
        )

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

      const updatedTask =
        await Task.findOneAndUpdate(
          {
            _id: req.params.id,
            user: req.user._id,
          },
          update,

          {
            returnDocument: "after",
          }
        )

      logReminderSchedule(updatedTask, "updated")

      res.json(updatedTask)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
}

export const deleteTask =
  async (req, res) => {

    try {

      const task =
        await Task.findOne({

          _id: req.params.id,

          user: req.user._id,
        })

      if (!task) {

        return res
          .status(404)
          .json({
            message:
              "Task not found",
          })
      }

      await task.deleteOne()

      res.json({
        message:
          "Task deleted",
      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
}
