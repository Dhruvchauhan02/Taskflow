import { useMemo } from "react"

import {
  CheckCircle2,
  Clock3,
  ListTodo,
  Sparkles,
} from "lucide-react"

import DashboardLayout
  from "../layouts/DashboardLayout"

import { useAuth }
  from "../context/AuthContext"

import { useTasks }
  from "../context/TaskContext"

function Profile() {

  const { user } =
    useAuth()

  const { tasks } =
    useTasks()

  const stats =
    useMemo(() => {

      const total =
        tasks.length

      const completed =
        tasks.filter(
          (task) =>
            task.status ===
            "Completed"
        ).length

      const pending =
        tasks.filter(
          (task) =>
            task.status ===
            "Pending"
        ).length

      const productivity =
        total > 0
          ? Math.round(
              (completed /
                total) *
                100
            )
          : 0

      return {
        total,
        completed,
        pending,
        productivity,
      }

    }, [tasks])

  const joinedDate =
    user?.user?.createdAt
      ? new Date(
          user.user.createdAt
        ).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )
      : "Not available"

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <div
          className="
            rounded-[2rem]
            border
            border-white/[0.08]
            bg-white/[0.05]
            p-8
            backdrop-blur-2xl
          "
        >

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-5">

              <div
                className="
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-sky-400
                  to-violet-500
                  text-3xl
                  font-bold
                  text-white
                  shadow-xl
                "
              >
                {user?.user?.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <div>

                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-sky-300">
                  Profile
                </p>

                <h1 className="text-4xl font-semibold text-white">
                  {user?.user?.name}
                </h1>

                <p className="mt-2 text-slate-400">
                  {user?.user?.email}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Joined {joinedDate}
                </p>

              </div>

            </div>

            <div
              className="
                rounded-[1.5rem]
                bg-white/[0.04]
                px-6
                py-5
                ring-1
                ring-white/[0.06]
              "
            >

              <div className="flex items-center gap-2 text-sky-300">
                <Sparkles size={18} />
                <span className="text-sm font-medium">
                  Productivity
                </span>
              </div>

              <h2 className="mt-3 text-5xl font-bold text-white">
                {stats.productivity}%
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Based on completed tasks
              </p>

            </div>

          </div>

        </div>

        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-300">
                <ListTodo size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Total Tasks
                </p>

                <h3 className="text-3xl font-semibold text-white">
                  {stats.total}
                </h3>
              </div>

            </div>

          </div>

          <div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Completed
                </p>

                <h3 className="text-3xl font-semibold text-white">
                  {stats.completed}
                </h3>
              </div>

            </div>

          </div>

          <div className="rounded-[1.75rem] border border-white/[0.08] bg-white/[0.05] p-6 backdrop-blur-xl">

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-amber-400/10 p-3 text-amber-300">
                <Clock3 size={22} />
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Pending
                </p>

                <h3 className="text-3xl font-semibold text-white">
                  {stats.pending}
                </h3>
              </div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  )
}

export default Profile
