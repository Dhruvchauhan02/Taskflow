import cron from "node-cron"

import Task from "../models/Task.js"
import {
  sendTaskReminderEmail,
  verifySmtpConnection,
} from "../services/emailService.js"

let reminderTask = null
let isReminderJobRunning = false

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
    const dueTasks = await getDueReminderTasks(new Date())

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
          continue
        }

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

    verifySmtpConnection().catch((error) => {
      console.error("SMTP connection failed:", error.message)
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

    return reminderTask
  } catch (error) {
    console.error("Failed to start reminder cron:", error.message)
    return null
  }
}
