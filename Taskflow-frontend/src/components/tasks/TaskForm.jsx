import { useState } from "react"
import { CalendarPlus, Plus, Sparkles } from "lucide-react"
import {
  TASK_CATEGORIES,
  TASK_PRIORITIES,
} from "../../utils/taskConfig"
import FormField from "./FormField"
import RecurrenceControl from "./RecurrenceControl"
import SelectField, {
  premiumFieldClass,
  selectOptionClass,
} from "../ui/SelectField"

const fieldClass =
  premiumFieldClass

const sectionClass =
  "rounded-[1.25rem] bg-black/[0.1] p-3.5 ring-1 ring-white/[0.055] sm:p-4"

function getReminderPart(value, part) {
  if (!value) {
    return ""
  }

  const [date = "", time = ""] = value.split("T")
  return part === "date" ? date : time
}

function mergeReminder(value, part, nextValue) {
  const date = part === "date" ? nextValue : getReminderPart(value, "date")
  const time = part === "time" ? nextValue : getReminderPart(value, "time")

  if (!date && !time) {
    return ""
  }

  return `${date || new Date().toISOString().slice(0, 10)}T${time || "09:00"}`
}

function TaskForm({
  taskTitle,
  setTaskTitle,
  description,
  setDescription,
  priority,
  setPriority,
  category,
  setCategory,
  dueDate,
  setDueDate,
  reminderAt,
  setReminderAt,
  recurrence,
  setRecurrence,
  tagInput,
  setTagInput,
  onSubmit,
  onAiFill,
}) {
  const [aiText, setAiText] = useState("")

  return (
    <section className="mb-4 rounded-[1.5rem] bg-white/[0.052] p-4 shadow-xl shadow-black/10 ring-1 ring-white/[0.07] backdrop-blur-lg sm:p-5">
      <div className="mb-4 rounded-[1.25rem] bg-black/[0.1] p-3.5 ring-1 ring-white/[0.07] sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Describe your task in plain English..."
            value={aiText}
            onChange={(event) => setAiText(event.target.value)}
            className="min-w-0 flex-1 rounded-[1rem] bg-black/[0.18] px-3.5 py-3 text-sm text-white outline-none ring-1 ring-white/[0.075] transition placeholder:text-slate-600 focus:bg-black/30 focus:ring-white/25"
          />
          <button
            type="button"
            onClick={() => onAiFill(aiText)}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[1rem] bg-white/[0.94] px-4 text-sm font-semibold text-slate-950 shadow-md shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            <Sparkles size={16} />
            Fill with AI
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[1rem] bg-white/[0.92] text-slate-950 shadow-md shadow-white/5">
          <CalendarPlus size={16} />
        </div>
        <div>
          <h2 className="text-base font-semibold tracking-tight text-white">
            New task
          </h2>
          <p className="text-xs text-slate-500">
            Add context now so the task stays clear later.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <div className={sectionClass}>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-200">
              Basic Information
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Name the task and choose how it should be grouped.
            </p>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_150px_160px]">
            <FormField label="Task Title">
              <input
                type="text"
                placeholder="e.g. Prepare sprint notes"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                className={fieldClass}
              />
            </FormField>

            <FormField label="Priority">
              <SelectField
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              >
                {TASK_PRIORITIES.map((item) => (
                  <option key={item} value={item} className={selectOptionClass}>
                    {item}
                  </option>
                ))}
              </SelectField>
            </FormField>

            <FormField label="Category / Type">
              <SelectField
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {TASK_CATEGORIES.map((item) => (
                  <option key={item} value={item} className={selectOptionClass}>
                    {item}
                  </option>
                ))}
              </SelectField>
            </FormField>
          </div>
        </div>

        <div className={sectionClass}>
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-200">
              Scheduling
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Set deadlines, reminders, and repeat behavior.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            <FormField label="Due Date">
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className={fieldClass}
              />
            </FormField>

            <FormField label="Reminder Date">
              <input
                type="date"
                value={getReminderPart(reminderAt, "date")}
                onChange={(event) =>
                  setReminderAt(mergeReminder(reminderAt, "date", event.target.value))
                }
                className={fieldClass}
              />
            </FormField>

            <FormField label="Reminder Time">
              <input
                type="time"
                value={getReminderPart(reminderAt, "time")}
                onChange={(event) =>
                  setReminderAt(mergeReminder(reminderAt, "time", event.target.value))
                }
                className={fieldClass}
              />
            </FormField>
          </div>

          <FormField
            label="Recurring Type"
            helper="Choose None for one-time tasks, or repeat on a schedule."
            className="mt-3"
          >
            <RecurrenceControl
              value={recurrence}
              onChange={setRecurrence}
            />
          </FormField>
        </div>
      </div>

      <div className={`${sectionClass} mt-3`}>
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-slate-200">
            Tags & Notes
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Add searchable context without cluttering the task title.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.7fr)]">
          <FormField label="Description">
            <textarea
              placeholder="Add useful details, acceptance notes, or links..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-28 w-full resize-none rounded-[1rem] bg-black/[0.18] px-3.5 py-3 text-sm leading-6 text-white outline-none ring-1 ring-white/[0.075] transition placeholder:text-slate-600 focus:bg-black/30 focus:ring-white/25"
            />
          </FormField>

          <div className="flex flex-col gap-3">
            <FormField
              label="Tags"
              helper="Separate tags with commas."
            >
              <input
                type="text"
                placeholder="frontend, internship, urgent"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                className={fieldClass}
              />
            </FormField>

            <button
              type="button"
              onClick={onSubmit}
              className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-[1rem] bg-white/[0.94] px-4 text-sm font-semibold text-slate-950 shadow-md shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              <Plus size={17} />
              Add Task
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TaskForm
