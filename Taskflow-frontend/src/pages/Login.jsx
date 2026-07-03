import { useState } from "react"
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom"
import toast from "react-hot-toast"
import { GoogleLogin } from "@react-oauth/google"

import {
  googleLoginAPI,
  loginAPI,
} from "../services/authService"
import { useAuth } from "../context/AuthContext"

function Login() {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  if (user) {
    return <Navigate to="/dashboard" />
  }

  const handleGoogleAuth = async (credentialResponse) => {
    try {
      const data = await googleLoginAPI(credentialResponse.credential)
      login(data)
      toast.success("Signed in with Google")
      navigate("/dashboard")
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Google sign in failed"
      )
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const data = await loginAPI({
        email,
        password,
      })

      login(data)
      toast.success("Login Successful")
      navigate("/tasks")
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed"
      )
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_35%),radial-gradient(circle_at_bottom,rgba(139,92,246,0.16),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.05] p-8 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <div className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-sky-300">
            TaskFlow
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to continue managing your workflow.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40 focus:bg-black/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40 focus:bg-black/30"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-white py-3 font-medium text-black transition hover:scale-[1.01] hover:bg-slate-200"
          >
            Login
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-500">
          <span className="h-px flex-1 bg-white/[0.08]" />
          or
          <span className="h-px flex-1 bg-white/[0.08]" />
        </div>

        <div className="rounded-[1.5rem] border border-white/[0.08] bg-black/20 p-4 shadow-inner shadow-black/20">
          <p className="mb-3 text-center text-sm font-medium text-slate-200">
            Continue securely with your Google account
          </p>
          <div className="flex justify-center overflow-hidden rounded-full">
            <GoogleLogin
              onSuccess={handleGoogleAuth}
              onError={() => toast.error("Google sign in failed")}
              theme="filled_black"
              size="large"
              shape="pill"
              text="signin_with"
              logo_alignment="center"
              width="336"
            />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to TaskFlow?{" "}
          <Link
            to="/register"
            className="font-medium text-slate-200 transition hover:text-white"
          >
            Sign up with Google
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login