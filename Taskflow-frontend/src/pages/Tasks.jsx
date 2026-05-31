import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import toast from "react-hot-toast"

import {
  CalendarDays,
  Kanban,
  ListTodo,
  Search,
  Sparkles,
} from "lucide-react"

import DashboardLayout from "../layouts/DashboardLayout"

import TaskCard from "../components/TaskCard"

import CalendarView from "../components/tasks/CalendarView"

import KanbanBoard from "../components/tasks/KanbanBoard"

import TaskDetailModal from "../components/tasks/TaskDetailModal"

import TaskFilters from "../components/tasks/TaskFilters"

import TaskForm from "../components/tasks/TaskForm"

import ActivityTimeline from "../components/tasks/ActivityTimeline"

import {
  parseTags,
  sortTasks,
  taskMatchesFilters,
} from "../utils/taskUtils"

import {
  useTasks,
} from "../context/TaskContext"

const viewOptions = [

  {
    value: "list",
    label: "List",
    icon: ListTodo,
  },

  {
    value: "kanban",
    label: "Kanban",
    icon: Kanban,
  },

  {
    value: "calendar",
    label: "Calendar",
    icon: CalendarDays,
  },

  {
    value: "timeline",
    label: "Timeline",
    icon: Sparkles,
  },
]

function Tasks() {

  const {

    tasks,

    createTask,

    updateTask,

    deleteTask,

    loading,

  } = useTasks()

  const [
    taskTitle,
    setTaskTitle,
  ] = useState("")

  const [
    description,
    setDescription,
  ] = useState("")

  const [
    priority,
    setPriority,
  ] = useState("Medium")

  const [
    category,
    setCategory,
  ] = useState("Work")

  const [
    dueDate,
    setDueDate,
  ] = useState("")

  const [
    reminderAt,
    setReminderAt,
  ] = useState("")

  const [
    recurrence,
    setRecurrence,
  ] = useState("None")

  const [
    tagInput,
    setTagInput,
  ] = useState("")

  const [
    selectedTask,
    setSelectedTask,
  ] = useState(null)

  const [
    viewMode,
    setViewMode,
  ] = useState("list")

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  const [
    filters,
    setFilters,
  ] = useState({

    searchTerm: "",

    status: "All",

    priority: "All",

    category: "All",

    tagFilter: "",

    overdueOnly: false,
  })

  const [
    sortBy,
    setSortBy,
  ] = useState(
    () =>
      localStorage.getItem(
        "taskSortBy"
      ) || "newest"
  )

  useEffect(() => {

    localStorage.setItem(
      "taskSortBy",
      sortBy
    )

  }, [sortBy])

  const allTags =
    useMemo(() => {

      return [

        ...new Set(

          tasks.flatMap(
            (task) =>
              task.tags || []
          )
        ),

      ].sort()

    }, [tasks])

  const filteredTasks =
    useMemo(() => {

      return sortTasks(

        tasks.filter(

          (task) =>
            taskMatchesFilters(
              task,
              filters
            )
        ),

        sortBy
      )

    }, [
      tasks,
      filters,
      sortBy,
    ])

  const allActivities =
    useMemo(() => {

      return tasks

        .flatMap((task) =>

          (task.activities || []).map(
            (activity) => ({

              ...activity,

              message:
                `${task.title}: ${activity.message}`,
            })
          )
        )

        .sort(
          (a, b) =>
            new Date(a.at) -
            new Date(b.at)
        )

    }, [tasks])

  const resetForm = () => {

    setTaskTitle("")

    setDescription("")

    setPriority("Medium")

    setCategory("Work")

    setDueDate("")

    setReminderAt("")

    setRecurrence("None")

    setTagInput("")
  }

  const addTask = async () => {

    if (isSubmitting) return

    if (
      taskTitle.trim() === ""
    ) {

      toast.error(
        "Task title is required"
      )

      return
    }

    try {

      setIsSubmitting(true)

      const newTask = {

        title:
          taskTitle.trim(),

        description:
          description.trim(),

        status: "Pending",

        priority,

        category,

        tags:
          parseTags(
            tagInput
          ),

        dueDate,

        reminderAt:
          reminderAt,

        reminderTime:
          reminderAt.split("T")[1] ||
          "",

        recurrence:
          recurrence,
      }

      await createTask(
        newTask
      )

      resetForm()

      toast.success(
        "Task Added"
      )

    } catch (error) {

      console.log(error)

      toast.error(
        "Failed to add task"
      )

    } finally {

      setIsSubmitting(false)
    }
  }

  const editTask =
    async (
      id,
      updates
    ) => {

      try {

        await updateTask(
          id,
          updates
        )

        toast.success(
          "Task Updated"
        )

      } catch (error) {

        console.log(error)

        toast.error(
          "Failed to update task"
        )
      }
    }

  const moveTask =
    async (
      id,
      status
    ) => {

      try {

        await updateTask(
          id,
          { status }
        )

        toast.success(
          `Moved to ${status}`
        )

      } catch (error) {

        console.log(error)

        toast.error(
          "Failed to move task"
        )
      }
    }

  if (loading) {

    return (

      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          text-white
        "
      >
        Loading...
      </div>
    )
  }

  return (

    <DashboardLayout>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Tasks
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Plan, sort, schedule, and review the work that deserves your focus.
          </p>

        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/[0.055] px-3 py-1.5 text-xs text-slate-400 ring-1 ring-white/[0.07] backdrop-blur-md">

          <Sparkles size={15} />

          {filteredTasks.length} visible

        </div>

      </div>

      <TaskForm
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        description={description}
        setDescription={setDescription}
        priority={priority}
        setPriority={setPriority}
        category={category}
        setCategory={setCategory}
        dueDate={dueDate}
        setDueDate={setDueDate}
        reminderAt={reminderAt}
        setReminderAt={setReminderAt}
        recurrence={recurrence}
        setRecurrence={setRecurrence}
        tagInput={tagInput}
        setTagInput={setTagInput}
        onSubmit={addTask}
        isSubmitting={isSubmitting}
      />

      <TaskFilters
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        allTags={allTags}
      />

      <div className="mb-5 flex flex-wrap gap-2">

        {viewOptions.map(
          ({
            value,
            label,
            icon: Icon,
          }) => (

            <button
              key={value}
              onClick={() =>
                setViewMode(value)
              }
              className={`
                inline-flex
                h-10
                items-center
                gap-2
                rounded-[1rem]
                px-3.5
                text-sm
                font-medium
                ring-1
                transition
                ${
                  viewMode === value

                    ? "bg-white text-slate-950 ring-white shadow-lg shadow-white/10"

                    : "bg-white/[0.055] text-slate-400 ring-white/[0.07] hover:bg-white/[0.09] hover:text-white"
                }
              `}
            >

              <Icon size={15} />

              {label}

            </button>
          )
        )}

      </div>

      {filteredTasks.length > 0 ? (

        <AnimatePresence mode="wait">

          {viewMode === "list" && (

            <motion.div
              key="list"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="grid grid-cols-1 gap-3 xl:grid-cols-2"
            >

              {filteredTasks.map(
                (task) => (

                  <TaskCard
                    key={task._id}
                    {...task}
                    onDelete={() =>
                      deleteTask(
                        task._id
                      )
                    }
                    onEdit={(updates) =>
                      editTask(
                        task._id,
                        updates
                      )
                    }
                    onOpen={() =>
                      setSelectedTask(
                        task
                      )
                    }
                  />
                )
              )}

            </motion.div>
          )}

          {viewMode === "kanban" && (

            <motion.div
              key="kanban"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
            >

              <KanbanBoard
                tasks={filteredTasks}
                onDropTask={moveTask}
                onDelete={deleteTask}
                onEdit={editTask}
                onOpen={setSelectedTask}
              />

            </motion.div>
          )}

          {viewMode === "calendar" && (

            <motion.div
              key="calendar"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
            >

              <CalendarView
                tasks={filteredTasks}
                onOpenTask={
                  setSelectedTask
                }
              />

            </motion.div>
          )}

          {viewMode === "timeline" && (

            <motion.div
              key="timeline"
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="max-w-3xl"
            >

              <ActivityTimeline
                activities={
                  allActivities
                }
              />

            </motion.div>
          )}

        </AnimatePresence>

      ) : (

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="rounded-[1.5rem] bg-white/[0.052] p-8 text-center shadow-xl shadow-black/10 ring-1 ring-white/[0.07] backdrop-blur-xl"
        >

          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-white/[0.07] text-slate-300 ring-1 ring-white/[0.07]">

            <Search size={20} />

          </div>

          <h2 className="text-xl font-semibold tracking-tight">
            No Tasks Found
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
            Try changing your filters,
            clearing the tag search,
            or creating a new task above.
          </p>

        </motion.div>
      )}

      <TaskDetailModal
        task={selectedTask}
        onClose={() =>
          setSelectedTask(null)
        }
      />

    </DashboardLayout>
  )
}

export default Tasks
