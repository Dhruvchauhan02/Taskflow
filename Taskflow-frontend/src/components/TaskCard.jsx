import { useState } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Check,
  Clock3,
  Eye,
  MoreHorizontal,
  Pencil,
  Repeat2,
  Tag,
  Trash2,
} from "lucide-react"
import TaskBadge from "./tasks/TaskBadge"
import FormField from "./tasks/FormField"
import RecurrenceControl from "./tasks/RecurrenceControl"
import SelectField, {
  premiumFieldClass,
  selectOptionClass,
} from "./ui/SelectField"
import {
  categoryStyles,
  priorityStyles,
  statusStyles,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "../utils/taskConfig"
import { isOverdue, parseTags } from "../utils/taskUtils"

const fieldClass =
  premiumFieldClass

const editSectionClass =
  "rounded-[1.15rem] bg-black/[0.12] p-3 ring-1 ring-white/[0.055]"

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

function TaskCard({
  title,
  status,
  priority,
  category,
  description,
  tags = [],
  reminderAt,
  recurrence,
  dueDate,
  createdAt,
  activities,
  onDelete,
  onEdit,
  onOpen,
}) {

  const [isEditing, setIsEditing] =
    useState(false)
  const [showDescription, setShowDescription] =
    useState(false)

  const [editedTitle, setEditedTitle] =
    useState(title)
  const [editedDescription, setEditedDescription] =
    useState(description || "")

  const [editedPriority,
    setEditedPriority] =
    useState(priority)
  const [editedCategory, setEditedCategory] =
    useState(category || "Work")
  const [editedTags, setEditedTags] =
    useState((tags || []).join(", "))
  const [editedReminderAt, setEditedReminderAt] =
    useState(reminderAt || "")
  const [editedRecurrence, setEditedRecurrence] =
    useState(recurrence || "None")

  const [editedDueDate,
    setEditedDueDate] =
    useState(dueDate)

  const [editedStatus,
    setEditedStatus] =
    useState(status)

  const handleSave = () => {

    if (editedTitle.trim() === "") {
      return
    }

    onEdit({
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority,
      category: editedCategory,
      tags: parseTags(editedTags),
      reminderAt: editedReminderAt,
      recurrence: editedRecurrence,
      dueDate: editedDueDate,
      status: editedStatus,
    })

    setIsEditing(false)
  }

  const overdue = isOverdue({ dueDate, status })
  const hasLongDescription = (description || "").length > 120

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      whileHover={{
        y: -4,
      }}

      transition={{
        duration: 0.32,
        ease: "easeOut",
      }}

      className="
        group
        relative
        overflow-hidden
        backdrop-blur-lg
        bg-white/[0.052]
        rounded-[1.45rem]
        p-4
        shadow-xl
        shadow-black/10
        ring-1
        ring-white/[0.07]
        transition
        duration-300
        hover:bg-white/[0.07]
        hover:shadow-black/20
      "
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/14 to-transparent" />
      <div className="absolute -right-14 -top-16 h-36 w-36 rounded-full bg-sky-300/[0.07] blur-3xl transition duration-500 group-hover:bg-violet-300/[0.08]" />
    

      {isEditing ? (
        <div className="relative mb-3 grid gap-3">
          <div className={editSectionClass}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Basic Information
            </h4>
            <div className="grid gap-3">
              <FormField label="Task Title">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) =>
                    setEditedTitle(
                      e.target.value
                    )
                  }
                  className={fieldClass}
                />
              </FormField>
              <FormField label="Description">
                <textarea
                  value={editedDescription}
                  onChange={(e) =>
                    setEditedDescription(
                      e.target.value
                    )
                  }
                  placeholder="Description or notes..."
                  className="min-h-24 w-full resize-none rounded-[1rem] bg-black/[0.16] px-3.5 py-2.5 text-sm leading-6 text-white outline-none ring-1 ring-white/[0.07] transition placeholder:text-slate-500 focus:bg-black/25 focus:ring-white/20"
                />
              </FormField>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex items-start justify-between gap-4">
          <h3
            className="
              text-lg
              font-semibold
              leading-6
              tracking-tight
              text-white
            "
          >
            {title}
          </h3>
          <button
            onClick={onOpen}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/[0.07] hover:text-slate-200"
            aria-label="Task options"
          >
            <MoreHorizontal size={17} />
          </button>
        </div>
      )}

      {isEditing ? (
        <div className="grid gap-3">
          <div className={editSectionClass}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Classification
            </h4>
            <div className="grid gap-3 sm:grid-cols-3">
              <FormField label="Status">
                <SelectField
                  value={editedStatus}
                  onChange={(e) =>
                    setEditedStatus(
                      e.target.value
                    )
                  }
                >
                  {TASK_STATUSES.map((item) => (
                    <option key={item} value={item} className={selectOptionClass}>
                      {item}
                    </option>
                  ))}
                </SelectField>
              </FormField>
              <FormField label="Priority">
                <SelectField
                  value={editedPriority}
                  onChange={(e) =>
                    setEditedPriority(
                      e.target.value
                    )
                  }
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
                  value={editedCategory}
                  onChange={(e) =>
                    setEditedCategory(
                      e.target.value
                    )
                  }
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

          <div className={editSectionClass}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              Scheduling
            </h4>
            <div className="grid gap-3 sm:grid-cols-3">
              <FormField label="Due Date">
                <input
                  type="date"
                  value={editedDueDate}
                  onChange={(e) =>
                    setEditedDueDate(
                      e.target.value
                    )
                  }
                  className={fieldClass}
                />
              </FormField>
              <FormField label="Reminder Date">
                <input
                  type="date"
                  value={getReminderPart(editedReminderAt, "date")}
                  onChange={(e) =>
                    setEditedReminderAt(
                      mergeReminder(editedReminderAt, "date", e.target.value)
                    )
                  }
                  className={fieldClass}
                />
              </FormField>
              <FormField label="Reminder Time">
                <input
                  type="time"
                  value={getReminderPart(editedReminderAt, "time")}
                  onChange={(e) =>
                    setEditedReminderAt(
                      mergeReminder(editedReminderAt, "time", e.target.value)
                    )
                  }
                  className={fieldClass}
                />
              </FormField>
            </div>

            <FormField
              label="Recurring Type"
              className="mt-3"
            >
              <RecurrenceControl
                value={editedRecurrence}
                onChange={setEditedRecurrence}
              />
            </FormField>
          </div>

          <div className={editSectionClass}>
            <FormField
              label="Tags"
              helper="Separate tags with commas."
            >
              <input
                type="text"
                value={editedTags}
                onChange={(e) =>
                  setEditedTags(
                    e.target.value
                  )
                }
                placeholder="frontend, internship, urgent"
                className="w-full rounded-[1rem] bg-black/[0.16] px-3.5 py-2.5 text-sm text-white outline-none ring-1 ring-white/[0.07] transition placeholder:text-slate-500 focus:bg-black/25 focus:ring-white/20"
              />
            </FormField>
          </div>
        </div>
      ) : (
        <div className="relative mt-4 flex flex-wrap gap-2">
          <TaskBadge className={statusStyles[status] || statusStyles.Pending}>
            {status}
          </TaskBadge>
          <TaskBadge className={priorityStyles[priority] || priorityStyles.Medium}>
            {priority}
          </TaskBadge>
          <TaskBadge className={categoryStyles[category] || categoryStyles.Work}>
            {category}
          </TaskBadge>
          {overdue && (
            <TaskBadge className="bg-red-300/[0.1] text-red-100 ring-red-200/20">
              Overdue
            </TaskBadge>
          )}
        </div>
      )}

      {!isEditing && description && (
        <div className="relative mt-4 rounded-[1rem] bg-black/[0.12] p-3 ring-1 ring-white/[0.05]">
          <p className="text-sm leading-6 text-slate-400">
            {showDescription || !hasLongDescription
              ? description
              : `${description.slice(0, 120)}...`}
          </p>
          {hasLongDescription && (
            <button
              onClick={() => setShowDescription((current) => !current)}
              className="mt-2 text-xs font-medium text-slate-200 transition hover:text-white"
            >
              {showDescription ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      )}

      {!isEditing && tags.length > 0 && (
        <div className="relative mt-4 flex flex-wrap gap-2">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-white/[0.055] px-2.5 py-1 text-[11px] text-slate-400 ring-1 ring-white/[0.06]"
            >
              <Tag size={11} />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="relative mt-4 grid gap-2.5 text-xs text-slate-500 sm:grid-cols-2">
          <div className="flex items-center gap-2">
          <Calendar
            size={14}
            className="text-slate-600"
          />

          <span>
            {dueDate
              ? new Date(dueDate)
                  .toLocaleString(
                    "en-IN",
                    {
                      timeZone:
                        "Asia/Kolkata",
                    }
                  )
              : "No due date"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3
            size={14}
            className="text-slate-600"
          />

          <span>
            Created{" "}
            {createdAt
              ? new Date(createdAt)
                  .toLocaleString(
                    "en-IN",
                    {
                      timeZone:
                        "Asia/Kolkata",
                    }
                  )
              : ""}
          </span>
        </div>
        {reminderAt && (
          <div className="flex items-center gap-2">
            <Clock3 size={14} className="text-slate-600" />
            <span>
              Reminder{" "}
              {new Date(reminderAt)
                .toLocaleString(
                  "en-IN",
                  {
                    timeZone:
                      "Asia/Kolkata",
                  }
                )}
            </span>
          </div>
        )}
        {recurrence && recurrence !== "None" && (
          <div className="flex items-center gap-2">
            <Repeat2 size={14} className="text-slate-600" />
            <span>{recurrence}</span>
          </div>
        )}
      </div>

      <div
        className="
          relative
          mt-4
          flex
          flex-wrap
          gap-2
        "
      >

        {isEditing ? (
          <button
            onClick={handleSave}
            className="
            inline-flex
            items-center
            gap-2
            rounded-[1rem]
            bg-white/[0.94]
            px-3.5
            py-2
            text-sm
            font-medium
            text-slate-950
            shadow-lg
            shadow-white/10
            transition
            hover:-translate-y-0.5
            hover:bg-slate-100
          "
          >
            <Check size={16} />
            Save
          </button>
        ) : (
          <>
            <button
              onClick={onOpen}
              className="
              inline-flex
              items-center
              gap-2
              rounded-[1rem]
              bg-white/[0.07]
              px-3.5
              py-2
              text-xs
              font-medium
              text-slate-300
              ring-1
              ring-white/[0.07]
              transition
              hover:-translate-y-0.5
              hover:bg-white/[0.11]
              hover:text-white
            "
            >
              <Eye size={15} />
              Details
            </button>
            <button
              onClick={() =>
                setIsEditing(true)
              }
              className="
            inline-flex
            items-center
            gap-2
            rounded-[1rem]
            bg-white/[0.07]
            px-3.5
            py-2
            text-xs
            font-medium
            text-slate-300
            ring-1
            ring-white/[0.07]
            transition
            hover:-translate-y-0.5
            hover:bg-white/[0.11]
            hover:text-white
          "
          >
            <Pencil size={15} />
            Edit
          </button>
          </>
        )}

        <button
          onClick={onDelete}
          className="
          inline-flex
          items-center
          gap-2
          rounded-[1rem]
          bg-rose-400/[0.08]
          px-3.5
          py-2
          text-xs
          font-medium
          text-rose-100
          ring-1
          ring-rose-200/15
          transition
          hover:-translate-y-0.5
          hover:bg-rose-400/15
        "
        >
          <Trash2 size={15} />
          Delete
        </button>

      </div>

      {!isEditing && activities?.length > 0 && (
        <div className="relative mt-4 border-t border-white/[0.06] pt-3 text-[11px] text-slate-600">
          Latest: {activities[activities.length - 1].message}
        </div>
      )}

    </motion.div>
  )
}

export default TaskCard
