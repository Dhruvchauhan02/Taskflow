const RESEND_API_URL = "https://api.resend.com/emails"
const EMAIL_TIMEOUT_MS = Number(process.env.EMAIL_TIMEOUT_MS || 30000)
const REMINDER_DEBUG = process.env.REMINDER_DEBUG === "true"

const getEmailConfig = () => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  const replyTo = process.env.EMAIL_REPLY_TO

  if (!apiKey || !from) {
    console.warn(
      "Email reminders disabled: RESEND_API_KEY and EMAIL_FROM are required"
    )
    return null
  }

  return {
    apiKey,
    from,
    replyTo,
  }
}

export const verifyEmailProvider = async () => {
  const config = getEmailConfig()

  if (!config) {
    return false
  }

  console.log("Email provider ready: Resend")
  return true
}

const formatDate = (date) => {
  if (!date) {
    return "No due date"
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

const escapeHtml = (value) => {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

const sendWithResend = async ({ apiKey, from, message }) => {
  const cleanMessage = Object.fromEntries(
    Object.entries(message).filter(([, value]) => value !== undefined)
  )

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanMessage),
    signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const detail =
      data?.message ||
      data?.error?.message ||
      JSON.stringify(data) ||
      `Resend request failed with ${response.status}`

    throw new Error(detail)
  }

  if (REMINDER_DEBUG) {
    console.log(`Resend accepted email request: ${JSON.stringify(data)}`)
  }

  return {
    ...data,
    from,
  }
}

export const sendTaskReminderEmail = async ({ task, user }) => {
  try {
    const config = getEmailConfig()

    if (!config) {
      throw new Error("Email provider is not configured")
    }

    const dueDate = formatDate(task.dueDate)
    const priority = task.priority || "Medium"
    const description = task.description || "No description provided"
    const safeTitle = escapeHtml(task.title)
    const safeDescription = escapeHtml(description)
    const safeDueDate = escapeHtml(dueDate)
    const safePriority = escapeHtml(priority)

    const info = await sendWithResend({
      ...config,
      message: {
        from: config.from,
        to: [user.email],
        reply_to: config.replyTo,
        subject: `TaskFlow Reminder: ${task.title}`,
        text: [
          `Task: ${task.title}`,
          `Description: ${description}`,
          `Due date: ${dueDate}`,
          `Priority: ${priority}`,
        ].join("\n"),
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>TaskFlow Reminder</h2>
            <p><strong>Task:</strong> ${safeTitle}</p>
            <p><strong>Description:</strong> ${safeDescription}</p>
            <p><strong>Due date:</strong> ${safeDueDate}</p>
            <p><strong>Priority:</strong> ${safePriority}</p>
          </div>
        `,
      },
    })

    console.log(
      `Reminder sent for task ${task._id} to ${user.email}; provider=resend; messageId=${info.id || "unknown"}`
    )

    return info
  } catch (error) {
    console.error(
      `Failed to send reminder for task ${task?._id}:`,
      error.message
    )
    throw error
  }
}
