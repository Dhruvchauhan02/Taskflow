import DashboardLayout from "../layouts/DashboardLayout"
import StatsCard from "../components/StatsCard"
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Flame,
  ListTodo,
  Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"
import { isOverdue } from "../utils/taskUtils"
import { useTasks }
  from "../context/TaskContext"
function Dashboard() {
  const { tasks } =
  useTasks()

  const totalTasks = tasks.length

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status === "In Progress"
  ).length

  const overdueTasks = tasks.filter(isOverdue).length

  const reminderTasks = tasks.filter(
    (task) => task.reminderAt
  ).length

  const categoryCount = new Set(
    tasks.map((task) => task.category).filter(Boolean)
  ).size

  return (
    <DashboardLayout>

      <section
        className="
          mb-5
          overflow-hidden
          rounded-[1.75rem]
          bg-white/[0.06]
          p-5
          shadow-2xl
          shadow-black/15
          ring-1
          ring-white/[0.08]
          backdrop-blur-xl
          sm:p-6
        "
      >
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="pointer-events-none absolute -right-12 -top-20 h-52 w-52 rounded-full bg-sky-200/[0.08] blur-3xl" />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-white/[0.07]">
              <Sparkles size={13} />
              Daily command center
            </div>

            <h1
              className="
                max-w-2xl
                text-3xl
                font-semibold
                tracking-tight
                text-white
                sm:text-4xl
              "
            >
              Welcome back. Keep the day light and intentional.
            </h1>

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-slate-400
              "
            >
              A focused view of what is open, moving, and already finished.
            </p>
          </div>

          <div className="relative flex flex-wrap items-center gap-2">
            <Link
              to="/tasks"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[1rem] bg-white px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Review tasks
              <ArrowRight size={15} />
            </Link>
            <div className="rounded-[1rem] bg-black/[0.16] px-3 py-2 text-xs text-slate-400 ring-1 ring-white/[0.06]">
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>

      <h1
        className="
          text-2xl
          font-semibold
          tracking-tight
          text-white
          sm:text-3xl
        "
      >
        Overview
      </h1>

      <p
        className="
          mt-2
          max-w-2xl
          text-sm
          leading-6
          text-slate-400
        "
      >
        Your work, distilled into a calm overview with just enough signal.
      </p>
        </div>

        <div className="rounded-full bg-white/[0.055] px-3 py-1.5 text-xs text-slate-400 ring-1 ring-white/[0.07] backdrop-blur-md">
          {totalTasks} tasks tracked
        </div>

    </div>

      <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-3
        lg:gap-4
      "
    >

        <StatsCard
          title="Total"
          count={totalTasks}
          icon={ListTodo}
          accent="from-sky-300/40 to-cyan-300/10"
        />

        <StatsCard
          title="Pending"
          count={pendingTasks}
          icon={CircleDashed}
          accent="from-amber-200/40 to-orange-300/10"
        />

        <StatsCard
          title="Done"
          count={completedTasks}
          icon={CheckCircle2}
          accent="from-emerald-300/40 to-teal-300/10"
        />

        <StatsCard
          title="In Progress"
          count={inProgressTasks}
          icon={Clock3}
          accent="from-violet-300/40 to-fuchsia-300/10"
        />

      </div>

      <div className="mt-5 rounded-[1.5rem] bg-white/[0.045] p-5 shadow-xl shadow-black/10 ring-1 ring-white/[0.07] backdrop-blur-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Flow summary
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Keep the active list light, finish the visible work, and let the system stay quiet.
            </p>
          </div>
          <div className="flex gap-2">
            {[
              `${overdueTasks} overdue`,
              `${reminderTasks} reminders`,
              `${categoryCount} categories`,
            ].map((item) => (
              <span
                key={item}
                className="rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-medium text-slate-400 ring-1 ring-white/[0.07]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.35rem] bg-white/[0.04] p-4 ring-1 ring-white/[0.07] backdrop-blur-lg">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Flame size={16} className="text-rose-200" />
            Priority watch
          </div>
          <p className="text-sm leading-6 text-slate-500">
            {overdueTasks > 0
              ? `${overdueTasks} task${overdueTasks > 1 ? "s are" : " is"} overdue and should be reviewed.`
              : "No overdue tasks. The workspace is in a healthy state."}
          </p>
        </div>

        <div className="rounded-[1.35rem] bg-white/[0.04] p-4 ring-1 ring-white/[0.07] backdrop-blur-lg">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Bell size={16} className="text-sky-200" />
            Reminder layer
          </div>
          <p className="text-sm leading-6 text-slate-500">
            {reminderTasks > 0
              ? `${reminderTasks} task${reminderTasks > 1 ? "s have" : " has"} reminder metadata ready for notifications.`
              : "Add reminders from the task form to prepare for future notifications."}
          </p>
        </div>
      </div>

    </DashboardLayout>
  )
}

export default Dashboard
