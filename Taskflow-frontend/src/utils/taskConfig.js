export const TASK_STATUSES = ["Pending", "In Progress", "Completed"]

export const TASK_PRIORITIES = ["Low", "Medium", "High"]

export const TASK_CATEGORIES = [
  "Work",
  "Personal",
  "Study",
  "Urgent",
  "Health",
  "Meetings",
]

export const RECURRENCE_OPTIONS = [
  "None",
  "Daily",
  "Weekly",
  "Monthly",
]

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "dueDate", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "alphabetical", label: "Alphabetical" },
]

export const categoryStyles = {
  Work: "bg-sky-300/[0.09] text-sky-100 ring-sky-200/15",
  Personal: "bg-violet-300/[0.09] text-violet-100 ring-violet-200/15",
  Study: "bg-indigo-300/[0.09] text-indigo-100 ring-indigo-200/15",
  Urgent: "bg-rose-300/[0.09] text-rose-100 ring-rose-200/15",
  Health: "bg-emerald-300/[0.09] text-emerald-100 ring-emerald-200/15",
  Meetings: "bg-amber-300/[0.09] text-amber-100 ring-amber-200/15",
}

export const statusStyles = {
  Pending: "bg-amber-300/[0.09] text-amber-100 ring-amber-200/15",
  "In Progress": "bg-sky-300/[0.09] text-sky-100 ring-sky-200/15",
  Completed: "bg-emerald-300/[0.09] text-emerald-100 ring-emerald-200/15",
}

export const priorityStyles = {
  Low: "bg-teal-300/[0.09] text-teal-100 ring-teal-200/15",
  Medium: "bg-violet-300/[0.09] text-violet-100 ring-violet-200/15",
  High: "bg-rose-300/[0.09] text-rose-100 ring-rose-200/15",
}

export const priorityRank = {
  High: 3,
  Medium: 2,
  Low: 1,
}
