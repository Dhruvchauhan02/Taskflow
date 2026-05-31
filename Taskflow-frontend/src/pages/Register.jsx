import { useState } from "react"
import {
  useNavigate,
  Navigate,
} from "react-router-dom"
import toast from "react-hot-toast"

import { registerAPI }
  from "../services/authService"

import { useAuth }
  from "../context/AuthContext"

function Register() {

  const navigate =
    useNavigate()

  const {
    login,
    user,
  } = useAuth()

  const [name, setName] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [password,
    setPassword] =
    useState("")
    if (user) {

      return (
        <Navigate
          to="/dashboard"
        />
      )
}

  const handleRegister =
    async (e) => {

      e.preventDefault()

      try {

        const data =
          await registerAPI({
            name,
            email,
            password,
          })

        login(data)

        toast.success(
          "Account Created"
        )

        navigate("/tasks")

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
            "Registration failed"
        )
      }
    }

  return (

    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712] px-4">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_35%),radial-gradient(circle_at_bottom,rgba(139,92,246,0.16),transparent_35%)]" />

      <div className="relative w-full max-w-md rounded-[2rem] border border-white/[0.08] bg-white/[0.05] p-8 shadow-2xl shadow-black/30 backdrop-blur-2xl">

        <div className="mb-8">
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-sky-300">
            TaskFlow
          </p>

          <h1 className="text-4xl font-semibold text-white">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Start organizing your workflow smarter.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 text-white outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/[0.06] bg-black/20 px-4 py-3 text-white outline-none"
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-white py-3 font-medium text-black transition hover:bg-slate-200"
          >
            Create Account
          </button>

        </form>

      </div>

    </div>
  )
}

export default Register