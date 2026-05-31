import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

function CalendarView({ tasks, onOpenTask }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  )

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    return [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: totalDays }, (_, index) => index + 1),
    ]
  }, [year, month])

  const tasksByDate = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!task.dueDate) return acc
      acc[task.dueDate] = [...(acc[task.dueDate] || []), task]
      return acc
    }, {})
  }, [tasks])

  const selectedTasks = tasksByDate[selectedDate] || []

  const moveMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1))
  }

  return (
    <section className="rounded-[1.5rem] bg-white/[0.045] p-4 shadow-xl shadow-black/10 ring-1 ring-white/[0.07] backdrop-blur-lg">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Calendar
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Tasks grouped by due date.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => moveMonth(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-[1rem] bg-white/[0.06] text-slate-300 ring-1 ring-white/[0.07] transition hover:bg-white/[0.1]"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <p className="min-w-36 text-center text-sm font-medium text-slate-200">
            {currentDate.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </p>
          <button
            onClick={() => moveMonth(1)}
            className="flex h-9 w-9 items-center justify-center rounded-[1rem] bg-white/[0.06] text-slate-300 ring-1 ring-white/[0.07] transition hover:bg-white/[0.1]"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-[11px] text-slate-600">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`blank-${index}`} />
          }

          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          const dayTasks = tasksByDate[dateKey] || []
          const selected = selectedDate === dateKey

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDate(dateKey)}
              className={`
                min-h-20
                rounded-[1rem]
                p-2
                text-left
                ring-1
                transition
                ${
                  selected
                    ? "bg-white/[0.12] ring-white/20"
                    : "bg-black/[0.12] ring-white/[0.05] hover:bg-white/[0.06]"
                }
              `}
            >
              <span className="text-xs font-medium text-slate-300">
                {day}
              </span>
              <div className="mt-2 space-y-1">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task._id}
                    className="truncate rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] text-slate-400"
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-[10px] text-slate-600">
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-4 rounded-[1.25rem] bg-black/[0.14] p-4 ring-1 ring-white/[0.06]">
        <h3 className="text-sm font-semibold text-white">
          {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </h3>
        <div className="mt-3 grid gap-2">
          {selectedTasks.length > 0 ? (
            selectedTasks.map((task) => (
              <button
                key={task._id}
                onClick={() => onOpenTask(task)}
                className="rounded-[1rem] bg-white/[0.055] px-3 py-2 text-left text-sm text-slate-300 ring-1 ring-white/[0.06] transition hover:bg-white/[0.09]"
              >
                {task.title}
              </button>
            ))
          ) : (
            <p className="text-sm text-slate-600">
              No tasks on this date.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default CalendarView
