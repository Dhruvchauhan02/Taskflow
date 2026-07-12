import cron from "node-cron"

import Task from "../models/Task.js"
import {
  sendTaskReminderEmail,
  verifyEmailProvider,
} from "../services/emailService.js"

let reminderTask = null
let isReminderJobRunning = false
const REMINDER_DEBUG = process.env.REMINDER_DEBUG === "true"

const getDueReminderTasks = async (now) => {
  return Task.find({
    reminderDate: {
      $ne: null,
      $lte: now,
    },
    reminderSent: {
      $ne: true,
    },
    status: {
      $ne: "Completed",
    },
  })
    .populate(
      "user",
      "email name notificationsEnabled reminderNotifications"
    )
    .limit(100)
}

export const processDueReminders = async () => {
  if (isReminderJobRunning) {
    return
  }

  isReminderJobRunning = true

  try {
    const now = new Date()
    const dueTasks = await getDueReminderTasks(now)

    if (REMINDER_DEBUG) {
      console.log(
        `Reminder scan at ${now.toISOString()}: found ${dueTasks.length} due task(s)`
      )
    }

    for (const task of dueTasks) {
      try {
        if (!task.user?.email) {
          console.warn(
            `Skipping reminder for task ${task._id}: owner email missing`
          )
          continue
        }

        if (
          task.user.notificationsEnabled === false ||
          task.user.reminderNotifications === false
        ) {
          console.log(
            `Skipping reminder for task ${task._id}: notifications disabled for ${task.user.email}`
          )
          continue
        }

        console.log(
          `Processing reminder for task ${task._id} (${task.title}) to ${task.user.email}; reminderDate=${task.reminderDate?.toISOString?.()}`
        )

        const claimedTask = await Task.findOneAndUpdate(
          {
            _id: task._id,
            reminderSent: {
              $ne: true,
            },
            reminderDate: {
              $ne: null,
              $lte: new Date(),
            },
            status: {
              $ne: "Completed",
            },
          },
          {
            $set: {
              reminderSent: true,
            },
          },
          {
            returnDocument: "after",
          }
        )

        if (!claimedTask) {
          if (REMINDER_DEBUG) {
            console.log(
              `Skipping reminder for task ${task._id}: already claimed or no longer due`
            )
          }
          continue
        }

        try {
          await sendTaskReminderEmail({
            task: claimedTask,
            user: task.user,
          })
        } catch (error) {
          await Task.updateOne(
            {
              _id: claimedTask._id,
            },
            {
              $set: {
                reminderSent: false,
              },
            }
          )
          console.error(
            `Reminder for task ${claimedTask._id} was not delivered; it will be retried on the next scan.`
          )
        }
      } catch (error) {
        console.error(
          `Reminder processing failed for task ${task?._id}:`,
          error.message
        )
      }
    }
  } catch (error) {
    console.error("Reminder job failed:", error.message)
  } finally {
    isReminderJobRunning = false
  }
}

export const startReminderJob = async () => {
  try {
    if (reminderTask) {
      return reminderTask
    }

    verifyEmailProvider().catch((error) => {
      console.error("Email provider check failed:", error.message)
    })

    reminderTask = cron.schedule(
      "* * * * *",
      () => {
        processDueReminders().catch((error) => {
          console.error("Reminder cron failed:", error.message)
        })
      },
      {
        scheduled: true,
      }
    )

    console.log("Reminder cron started")

    setTimeout(() => {
      processDueReminders().catch((error) => {
        console.error("Initial reminder scan failed:", error.message)
      })
    }, 5000)

    return reminderTask
  } catch (error) {
    console.error("Failed to start reminder cron:", error.message)
    return null
  }
}
