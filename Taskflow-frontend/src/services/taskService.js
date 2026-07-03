import axios from "axios"

const getToken = () => {
  try {
    localStorage.removeItem(
      "taskflowUser"
    )

  const storedUser =
    JSON.parse(
      sessionStorage.getItem(
        "taskflowUser"
      )
    )

  return storedUser?.token
  } catch {
    sessionStorage.removeItem(
      "taskflowUser"
    )
    localStorage.removeItem(
      "taskflowUser"
    )
    return null
  }
}
const API =
  import.meta.env.VITE_TASK_API_URL ||
  "http://localhost:5000/api/tasks"

const toDateInputValue = (value) => {
  if (!value) {
    return ""
  }

  return String(value).slice(0, 10)
}

const toLocalDateTimeInputValue = (value) => {
  if (!value) {
    return ""
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const offsetMs =
    date.getTimezoneOffset() * 60000

  return new Date(date.getTime() - offsetMs)
    .toISOString()
    .slice(0, 16)
}

const toReminderDateValue = (value) => {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

const getReminderTime = (value) => {
  if (!value) {
    return ""
  }

  return String(value).split("T")[1] || ""
}

const serializeTaskPayload = (taskData) => {
  const hasReminder =
    Object.prototype.hasOwnProperty.call(
      taskData,
      "reminderAt"
    ) ||
    Object.prototype.hasOwnProperty.call(
      taskData,
      "reminderDate"
    )

  const hasRecurrence =
    Object.prototype.hasOwnProperty.call(
      taskData,
      "recurrence"
    ) ||
    Object.prototype.hasOwnProperty.call(
      taskData,
      "recurringType"
    )

  const payload = {
    ...taskData,
  }

  if (
    Object.prototype.hasOwnProperty.call(
      taskData,
      "dueDate"
    )
  ) {
    payload.dueDate =
      taskData.dueDate || null
  }

  if (hasReminder) {
    const reminderAt =
      taskData.reminderAt ??
      taskData.reminderDate ??
      ""

    payload.reminderDate =
      toReminderDateValue(
        reminderAt
      )

    payload.reminderTime =
      taskData.reminderTime ??
      getReminderTime(
        reminderAt
      )
  }

  if (hasRecurrence) {
    payload.recurringType =
      taskData.recurrence ??
      taskData.recurringType ??
      "None"
  }

  delete payload.reminderAt
  delete payload.recurrence

  return payload
}

const normalizeTask = (task) => {
  const reminderAt =
    toLocalDateTimeInputValue(
      task.reminderDate
    )

  return {
    ...task,
    dueDate:
      toDateInputValue(
        task.dueDate
      ),
    reminderDate:
      task.reminderDate || "",
    reminderAt,
    reminderTime:
      task.reminderTime ||
      getReminderTime(
        reminderAt
      ),
    recurringType:
      task.recurringType || "None",
    recurrence:
      task.recurringType || "None",
  }
}

export const fetchTasks =
  async () => {

    const response =
      await axios.get(API, {
              headers: {
                Authorization:
                  `Bearer ${getToken()}`,
              },
            })

    return response.data.map(
      normalizeTask
    )
}

export const createTaskAPI =
  async (taskData) => {

    const response =
      await axios.post(
              API,
              serializeTaskPayload(
                taskData
              ),
              {
                headers: {
                  Authorization:
                    `Bearer ${getToken()}`,
                },
              }
            )

    return normalizeTask(
      response.data
    )
}

export const updateTaskAPI =
  async (
    id,
    updatedData
  ) => {

    const response =
      await axios.put(
              `${API}/${id}`,
              serializeTaskPayload(
                updatedData
              ),
              {
                headers: {
                  Authorization:
                    `Bearer ${getToken()}`,
                },
              }
            )

    return normalizeTask(
      response.data
    )
}

export const deleteTaskAPI =
  async (id) => {

    const response =
      await axios.delete(
              `${API}/${id}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${getToken()}`,
                },
              }
            )

    return response.data
}
