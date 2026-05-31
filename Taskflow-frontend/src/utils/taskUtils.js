import { priorityRank } from "./taskConfig"

export function parseTags(value) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean)
    .filter((tag, index, tags) => tags.indexOf(tag) === index)
}

export function isOverdue(task) {
  if (!task.dueDate || task.status === "Completed") {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const due = new Date(`${task.dueDate}T00:00:00`)
  return due < today
}

export function formatDateTime(value) {
  if (!value) {
    return "Not set"
  }

  const date =
    new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Not set"
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

const getTaskTime = (task) => {
  const date =
    new Date(
      task.createdAt ||
      task.updatedAt ||
      0
    )

  return Number.isNaN(date.getTime())
    ? 0
    : date.getTime()
}

export function createActivity(type, message) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${type}`,
    type,
    message,
    at: new Date().toISOString(),
  }
}

export function normalizeTask(task) {
  const normalized = {
    description: "",
    category: "Work",
    tags: [],
    reminderAt: "",
    recurrence: "None",
    activities: [
      createActivity(
        "created",
        `Task created${task.createdAt ? ` on ${task.createdAt}` : ""}`
      ),
    ],
    ...task,
  }

  return {
    ...normalized,
    tags: Array.isArray(task.tags) ? task.tags : [],
    activities: Array.isArray(task.activities) && task.activities.length > 0
      ? task.activities
      : normalized.activities,
  }
}

export function sortTasks(tasks, sortBy) {
  const sorted = [...tasks]

  return sorted.sort((a, b) => {
    if (sortBy === "oldest") {
      return getTaskTime(a) - getTaskTime(b)
    }

    if (sortBy === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    }

    if (sortBy === "priority") {
      return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0)
    }

    if (sortBy === "alphabetical") {
      return (a.title || "")
        .localeCompare(b.title || "")
    }

    return getTaskTime(b) - getTaskTime(a)
  })
}

export function taskMatchesFilters(task, filters) {
  const search =
    (filters.searchTerm || "")
      .trim()
      .toLowerCase()
  const tagFilter =
    (filters.tagFilter || "")
      .trim()
      .toLowerCase()
      .replace(/^#/, "")
  const searchable = [
    task.title,
    task.description,
    task.category,
    task.priority,
    task.status,
    ...(task.tags || []),
  ]
    .join(" ")
    .toLowerCase()

  const matchesSearch = search ? searchable.includes(search) : true
  const matchesStatus =
    filters.status === "All" ? true : task.status === filters.status
  const matchesPriority =
    filters.priority === "All" ? true : task.priority === filters.priority
  const matchesCategory =
    filters.category === "All" ? true : task.category === filters.category
  const matchesOverdue = filters.overdueOnly ? isOverdue(task) : true
  const matchesTag = tagFilter
    ? (task.tags || []).some((tag) => tag.toLowerCase().includes(tagFilter))
    : true

  return (
    matchesSearch &&
    matchesStatus &&
    matchesPriority &&
    matchesCategory &&
    matchesOverdue &&
    matchesTag
  )
}
