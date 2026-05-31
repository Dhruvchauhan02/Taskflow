import mongoose from "mongoose"

const taskSchema =
  new mongoose.Schema(
    {

      title: {
        type: String,
        required: true,
      },

      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      description: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "In Progress",
          "Completed",
        ],
        default: "Pending",
      },

      priority: {
        type: String,
        enum: [
          "Low",
          "Medium",
          "High",
        ],
        default: "Medium",
      },

      category: {
        type: String,
        default: "General",
      },

      dueDate: {
        type: Date,
      },

      reminderDate: {
        type: Date,
      },

      reminderTime: {
        type: String,
        default: "",
      },

      reminderSent: {
        type: Boolean,
        default: false,
      },

      recurringType: {
        type: String,
        enum: [
          "None",
          "Daily",
          "Weekly",
          "Monthly",
        ],
        default: "None",
      },

      tags: [
        {
          type: String,
        },
      ],

    },

    {
      timestamps: true,
    }
  )

const Task =
  mongoose.model(
    "Task",
    taskSchema
  )

export default Task
