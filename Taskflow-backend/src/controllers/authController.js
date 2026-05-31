import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import User from "../models/User.js"
import {
  OAuth2Client,
} from "google-auth-library"
const client =
  new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
  )

const getUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  notificationsEnabled:
    user.notificationsEnabled,
  reminderNotifications:
    user.reminderNotifications,
  theme: user.theme,
  authProvider: user.authProvider,
  createdAt: user.createdAt,
})

export const registerUser =
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
      } = req.body

      const existingUser =
        await User.findOne({
          email,
        })

      if (existingUser) {

        return res
          .status(400)
          .json({
            message:
              "User already exists",
          })
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        )

      const user =
        await User.create({
          name,
          email,
          password:
            hashedPassword,
        })

      const token =
        jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        )

      res.status(201).json({
        token,
        user: getUserPayload(user),
      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
}
export const loginUser =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body

      const user =
        await User.findOne({
          email,
        })

      if (!user) {

        return res
          .status(400)
          .json({
            message:
              "Invalid credentials",
          })
      }

      if (!user.password) {

        return res
          .status(400)
          .json({
            message:
              "Use Google login for this account",
          })
      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        )

      if (!isMatch) {

        return res
          .status(400)
          .json({
            message:
              "Invalid credentials",
          })
      }

      const token =
        jwt.sign(
          {
            id: user._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        )

      res.json({
        token,
        user: getUserPayload(user),
      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
}
export const googleLogin =
  async (req, res) => {

    try {

      const { token } =
        req.body

      const ticket =
        await client.verifyIdToken({

          idToken: token,

          audience:
            process.env.GOOGLE_CLIENT_ID,
        })

      const payload =
        ticket.getPayload()

      const {

        sub,
        email,
        name,
        picture,

      } = payload

      let user =
        await User.findOne({
          email,
        })

      if (!user) {

        user =
          await User.create({

            name,

            email,

            googleId: sub,

            avatar: picture,

            authProvider:
              "google",
          })
      } else {
        user.googleId =
          user.googleId || sub

        user.avatar =
          user.avatar || picture

        if (
          user.authProvider !==
          "google"
        ) {
          user.authProvider =
            user.authProvider ||
            "google"
        }

        await user.save()
      }

      const jwtToken =
        jwt.sign(

          {
            id: user._id,
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "7d",
          }
        )

      res.json({

        token: jwtToken,

        user: getUserPayload(user),
      })

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
      })
    }
}
export const updateProfile =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        )

      if (!user) {

        return res
          .status(404)
          .json({
            message:
              "User not found",
          })
      }

      user.name =
        req.body.name ||
        user.name

      user.notificationsEnabled =
        req.body
          .notificationsEnabled ??
        user.notificationsEnabled

      user.reminderNotifications =
        req.body
          .reminderNotifications ??
        user.reminderNotifications

      if (
        [
          "dark",
          "light",
          "system",
        ].includes(req.body.theme)
      ) {
        user.theme =
          req.body.theme
      }

      const updatedUser =
        await user.save()

      res.json({

        user: getUserPayload(updatedUser),
      })

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      })
    }
}
