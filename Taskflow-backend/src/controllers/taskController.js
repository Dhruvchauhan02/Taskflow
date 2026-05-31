import Task from "../models/Task.js"

const prepareTaskPayload = (
  payload,
  existingTask = null
) => {
  const taskPayload = {
    ...payload,
  }

  delete taskPayload.user
  delete taskPayload.reminderSent

  if (
    Object.prototype.hasOwnProperty.call(
      taskPayload,
      "reminderAt"
    ) &&
    !Object.prototype.hasOwnProperty.call(
      taskPayload,
      "reminderDate"
    )
  ) {
    taskPayload.reminderDate =
      taskPayload.reminderAt
  }

  if (
    Object.prototype.hasOwnProperty.call(
      taskPayload,
      "recurrence"
    ) &&
    !Object.prototype.hasOwnProperty.call(
      taskPayload,
      "recurringType"
    )
  ) {
    taskPayload.recurringType =
      taskPayload.recurrence
  }

  delete taskPayload.reminderAt
  delete taskPayload.recurrence

  if (
    Object.prototype.hasOwnProperty.call(
      taskPayload,
      "reminderDate"
    )
  ) {
    const nextReminderDate =
      taskPayload.reminderDate || null

    taskPayload.reminderDate =
      nextReminderDate

    taskPayload.reminderTime =
      taskPayload.reminderTime ||
      (
        typeof nextReminderDate === "string" &&
        nextReminderDate.includes("T")
          ? nextReminderDate
              .split("T")[1]
              .slice(0, 5)
          : ""
      )

    if (
      !existingTask ||
      String(existingTask.reminderDate || "") !==
        String(nextReminderDate || "")
    ) {
      taskPayload.reminderSent = false
    }
  }

  return taskPayload
}

export const createTask =
  async (req, res) => {

    try {

      const task =
        await Task.create({
          ...prepareTaskPayload(req.body),
          user: req.user._id,
    })

      res.status(201).json(task)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
}

export const getTasks =
  async (req, res) => {

    try {

      const tasks =
        await Task.find({
          user: req.user._id,
        })

      res.json(tasks)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
}

export const updateTask =
  async (req, res) => {

    try {

      const task =
        await Task.findOne({

          _id: req.params.id,

          user: req.user._id,
        })

      if (!task) {

        return res
          .status(404)
          .json({
            message:
              "Task not found",
          })
      }

      const updatedTask =
        await Task.findOneAndUpdate(
          {
            _id: req.params.id,
            user: req.user._id,
          },
          prepareTaskPayload(
            req.body,
            task
          ),

          {
            new: true,
          }
        )

      res.json(updatedTask)

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
}

export const deleteTask =
  async (req, res) => {

    try {

      const task =
        await Task.findOne({

          _id: req.params.id,

          user: req.user._id,
        })

      if (!task) {

        return res
          .status(404)
          .json({
            message:
              "Task not found",
          })
      }

      await task.deleteOne()

      res.json({
        message:
          "Task deleted",
      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
}
