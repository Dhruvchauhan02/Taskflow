import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { parseTask, chatWithAI } from "../controllers/aiController.js"

const router = express.Router()
router.post("/parse-task", protect, parseTask)
router.post("/chat", protect, chatWithAI)
export default router
