import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-28 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-300/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-300/10 blur-3xl" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-center"
      >
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/[0.08] px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10 backdrop-blur-xl">
          <Sparkles size={15} />
          Premium productivity workspace
        </div>

        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
          TaskFlow
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          A calm task system with a refined dashboard, elegant task cards, and a focused workspace for daily execution.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-slate-950 shadow-xl shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            Open dashboard
            <ArrowRight size={17} />
          </Link>
          <Link
            to="/tasks"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-white/10 px-5 text-sm font-medium text-white ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/15"
          >
            Manage tasks
          </Link>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-3">
          {["Fast capture", "Smart filters", "Responsive flow"].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-3xl bg-white/[0.06] p-4 text-sm text-slate-300 ring-1 ring-white/10 backdrop-blur-xl"
            >
              <CheckCircle2 size={17} className="text-emerald-200" />
              {item}
            </div>
          ))}
        </div>
      </motion.section>
    </main>
  )
}

export default Home
