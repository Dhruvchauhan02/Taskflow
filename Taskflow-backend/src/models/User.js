import mongoose from "mongoose"

const userSchema =
  new mongoose.Schema(

    {

      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },
      googleId: {
        type: String,
      },

      password: {
        type: String,
      },

      avatar: {
        type: String,
        default: "",
      },

      notificationsEnabled: {
        type: Boolean,
        default: true,
      },

      reminderNotifications: {
        type: Boolean,
        default: true,
      },

      theme: {
        type: String,
        enum: [
          "dark",
          "light",
          "system",
        ],
        default: "dark",
      },

      authProvider: {
        type: String,
        enum: [
          "local",
          "google",
        ],
        default: "local",
      },

    },

    {
      timestamps: true,
    }
  )

const User =
  mongoose.model(
    "User",
    userSchema
  )

export default User