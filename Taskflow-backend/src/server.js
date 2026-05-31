import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import taskRoutes from "./routes/taskRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import { startReminderJob } from "./jobs/reminderJob.js"

dotenv.config()

const app = express()

app.use(cors())

app.use(express.json())
app.use(
  "/api/auth",
  authRoutes
)
app.use(
  "/api/tasks",
  taskRoutes
)
app.get("/", (req, res) => {
  res.json({
    message:
      "TaskFlow API Running",
  })
})

const PORT =
  process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()
    await startReminderJob()

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      )
    })
  } catch (error) {
    console.error(
      "Server startup failed:",
      error.message
    )
    process.exit(1)
  }
}

startServer()
