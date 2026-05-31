function TaskBadge({ children, className = "" }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-[11px]
        font-medium
        ring-1
        ${className}
      `}
    >
      {children}
    </span>
  )
}

export default TaskBadge
