import { Clock3 } from "lucide-react"
import { motion } from "framer-motion"
import { formatDateTime } from "../../utils/taskUtils"

function ActivityTimeline({ activities = [] }) {
  return (
    <div className="rounded-[1.25rem] bg-black/[0.14] p-4 ring-1 ring-white/[0.06]">
      <div className="mb-4 flex items-center gap-2">
        <Clock3 size={15} className="text-slate-500" />
        <h3 className="text-sm font-semibold text-white">
          Activity
        </h3>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.slice().reverse().map((item, index) => (
          <motion.div
            key={item.id || `${item.at}-${index}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="relative pl-5"
          >
            <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-white/40" />
            <p className="text-sm text-slate-300">
              {item.message}
            </p>
            <p className="mt-1 text-[11px] text-slate-600">
              {formatDateTime(item.at)}
            </p>
          </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">
          No activity recorded yet.
        </p>
      )}
    </div>
  )
}

export default ActivityTimeline
