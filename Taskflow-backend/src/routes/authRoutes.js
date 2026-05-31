import express
  from "express"

import {
  registerUser,
  loginUser,
  updateProfile,
  googleLogin,
} from "../controllers/authController.js"

import {
  protect,
} from "../middleware/authMiddleware.js"

const router =
  express.Router()

router.post(
  "/register",
  registerUser
)

router.post(
  "/login",
  loginUser
)
router.post(
  "/google",
  googleLogin
)

router.put(
  "/profile",
  protect,
  updateProfile
)

export default router