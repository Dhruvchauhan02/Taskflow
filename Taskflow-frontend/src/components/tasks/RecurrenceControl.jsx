import { RECURRENCE_OPTIONS } from "../../utils/taskConfig"

function RecurrenceControl({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {RECURRENCE_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`
            h-10
            rounded-[0.9rem]
            px-3
            text-xs
            font-medium
            ring-1
            transition
            ${
              value === option
                ? "bg-white/[0.92] text-slate-950 ring-white shadow-md shadow-white/10"
                : "bg-black/[0.14] text-slate-400 ring-white/[0.07] hover:bg-white/[0.08] hover:text-slate-100"
            }
          `}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default RecurrenceControl
