import { motion } from "framer-motion"
import { TASK_STATUSES } from "../../utils/taskConfig"
import TaskCard from "../TaskCard"

function KanbanBoard({
  tasks,
  onDropTask,
  onDelete,
  onEdit,
  onOpen,
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {TASK_STATUSES.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status)

        return (
          <section
            key={status}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const taskId = event.dataTransfer.getData("taskId")
              onDropTask(taskId, status)
            }}
            className="min-h-72 rounded-[1.5rem] bg-white/[0.04] p-3 ring-1 ring-white/[0.07] backdrop-blur-lg"
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-white">
                {status}
              </h3>
              <span className="rounded-full bg-white/[0.06] px-2 py-1 text-[11px] text-slate-500 ring-1 ring-white/[0.06]">
                {columnTasks.length}
              </span>
            </div>

            <div className="grid gap-3">
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <motion.div
                    layout
                    key={task._id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("taskId", task._id)
                    }}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <TaskCard
                      {...task}
                      onDelete={() => onDelete(task._id)}
                      onEdit={(updates) => onEdit(task._id, updates)}
                      onOpen={() => onOpen(task)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="rounded-[1.25rem] border border-dashed border-white/[0.08] p-5 text-center text-sm text-slate-600">
                  Drop tasks here
                </div>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default KanbanBoard
