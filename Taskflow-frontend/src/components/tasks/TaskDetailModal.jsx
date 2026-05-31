import { AnimatePresence, motion } from "framer-motion"
import {
  Calendar,
  Clock3,
  Repeat2,
  Tag,
  X,
} from "lucide-react"
import {
  categoryStyles,
  priorityStyles,
  statusStyles,
} from "../../utils/taskConfig"
import { formatDateTime, isOverdue } from "../../utils/taskUtils"
import ActivityTimeline from "./ActivityTimeline"
import TaskBadge from "./TaskBadge"

function TaskDetailModal({ task, onClose }) {
  const detailRows = [
    {
      label: "Due Date",
      value: task?.dueDate || "Not set",
      icon: Calendar,
    },
    {
      label: "Reminder",
      value: formatDateTime(task?.reminderAt),
      icon: Clock3,
    },
    {
      label: "Recurring Type",
      value: task?.recurrence || "None",
      icon: Repeat2,
    },
  ]

  return (
    <AnimatePresence>
      {task && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 p-3 backdrop-blur-md sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.section
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] bg-slate-950/80 p-5 text-white shadow-2xl shadow-black/40 ring-1 ring-white/[0.1] backdrop-blur-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <TaskBadge className={statusStyles[task.status] || statusStyles.Pending}>
                    {task.status}
                  </TaskBadge>
                  <TaskBadge className={priorityStyles[task.priority] || priorityStyles.Medium}>
                    {task.priority}
                  </TaskBadge>
                  <TaskBadge className={categoryStyles[task.category] || categoryStyles.Work}>
                    {task.category}
                  </TaskBadge>
                  {isOverdue(task) && (
                    <TaskBadge className="bg-red-300/[0.1] text-red-100 ring-red-200/20">
                      Overdue
                    </TaskBadge>
                  )}
                </div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {task.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Created {formatDateTime(task.createdAt)}
                </p>
              </div>

              <button
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] bg-white/[0.07] text-slate-300 ring-1 ring-white/[0.08] transition hover:bg-white/[0.12] hover:text-white"
                aria-label="Close task detail"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <div className="space-y-4">
                <div className="rounded-[1.25rem] bg-black/[0.14] p-4 ring-1 ring-white/[0.06]">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Description
                  </h3>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-400">
                    {task.description || "No description added yet."}
                  </p>
                </div>

                <ActivityTimeline activities={task.activities} />
              </div>

              <aside className="space-y-3">
                <div className="rounded-[1.25rem] bg-black/[0.14] p-4 ring-1 ring-white/[0.06]">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Scheduling
                  </h3>
                  <div className="space-y-3">
                    {detailRows.map(({ label, value, icon: Icon }) => (
                      <div
                        key={label}
                        className="rounded-[1rem] bg-white/[0.035] p-3 ring-1 ring-white/[0.045]"
                      >
                        <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-600">
                          <Icon size={13} />
                          {label}
                        </div>
                        <p className="text-sm text-slate-300">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.25rem] bg-black/[0.14] p-4 ring-1 ring-white/[0.06]">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(task.tags || []).length > 0 ? (
                      task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-white/[0.055] px-2.5 py-1 text-[11px] text-slate-400 ring-1 ring-white/[0.06]"
                        >
                          <Tag size={11} />
                          {tag}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">
                        No tags yet.
                      </p>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TaskDetailModal
