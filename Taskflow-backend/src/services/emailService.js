import nodemailer from "nodemailer"

let transporter
let smtpVerified = false
let smtpVerifyPromise = null

const getTransporter = () => {
  if (transporter) {
    return transporter
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      "Email reminders disabled: EMAIL_USER and EMAIL_PASS are required"
    )
    return null
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  return transporter
}

export const verifySmtpConnection = async () => {
  try {
    const mailer = getTransporter()

    if (!mailer || smtpVerified) {
      return smtpVerified
    }

    if (!smtpVerifyPromise) {
      smtpVerifyPromise = mailer.verify()
    }

    await smtpVerifyPromise
    smtpVerified = true
    console.log("SMTP connected")

    return true
  } catch (error) {
    smtpVerifyPromise = null
    smtpVerified = false
    console.error("SMTP connection failed:", error.message)
    return false
  }
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

export const sendTaskReminderEmail = async ({ task, user }) => {
  try {
    const mailer = getTransporter()

    if (!mailer) {
      throw new Error("Email transporter is not configured")
    }

    const dueDate = formatDate(task.dueDate)
    const priority = task.priority || "Medium"
    const description = task.description || "No description provided"
    const safeTitle = escapeHtml(task.title)
    const safeDescription = escapeHtml(description)
    const safeDueDate = escapeHtml(dueDate)
    const safePriority = escapeHtml(priority)

    const info = await mailer.sendMail({
      from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
      to: user.email,
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
    })

    console.log(
      `Reminder sent for task ${task._id} to ${user.email}`
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
