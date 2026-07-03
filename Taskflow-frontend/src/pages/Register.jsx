import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom"
import toast from "react-hot-toast"
import { GoogleLogin } from "@react-oauth/google"

import { googleLoginAPI } from "../services/authService"
import { useAuth } from "../context/AuthContext"

function Register() {
  const navigate = useNavigate()
  const { login, user } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" />
  }

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const data = await googleLoginAPI(credentialResponse.credential)
      login(data)
      toast.success("Signed up with Google")
      navigate("/dashboard")
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Google sign up failed"
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
            Sign up
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Create your workspace with Google. No password needed.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/[0.08] bg-black/20 p-5 shadow-inner shadow-black/20">
          <p className="mb-4 text-center text-sm font-medium text-slate-200">
            Use your Google account to create TaskFlow access
          </p>
          <div className="flex justify-center overflow-hidden rounded-full">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => toast.error("Google sign up failed")}
              theme="filled_black"
              size="large"
              shape="pill"
              text="signup_with"
              logo_alignment="center"
              width="336"
            />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-slate-200 transition hover:text-white"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register