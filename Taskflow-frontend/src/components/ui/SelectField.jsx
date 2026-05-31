import {
  ChevronDown,
} from "lucide-react"

export const selectOptionClass =
  "bg-slate-950 text-slate-100"

export const premiumFieldClass =
  `
    h-11
    min-h-11
    w-full
    rounded-[1rem]
    border
    border-white/[0.08]
    bg-black/[0.16]
    px-3.5
    text-sm
    font-medium
    text-slate-100
    shadow-sm
    shadow-black/10
    outline-none
    ring-1
    ring-white/[0.065]
    backdrop-blur-xl
    transition
    placeholder:text-slate-500
    hover:bg-white/[0.075]
    focus:border-sky-300/35
    focus:bg-black/[0.22]
    focus:ring-2
    focus:ring-sky-300/25
    disabled:cursor-not-allowed
    disabled:opacity-60
  `

function SelectField({
  children,
  className = "",
  wrapperClassName = "",
  ...props
}) {
  return (
    <div
      className={`
        relative
        w-full
        ${wrapperClassName}
      `}
    >
      <select
        {...props}
        className={`
          ${premiumFieldClass}
          appearance-none
          pr-10
          ${className}
        `}
      >
        {children}
      </select>

      <ChevronDown
        size={16}
        className="
          pointer-events-none
          absolute
          right-3.5
          top-1/2
          -translate-y-1/2
          text-slate-400
          transition
        "
      />
    </div>
  )
}

export default SelectField
