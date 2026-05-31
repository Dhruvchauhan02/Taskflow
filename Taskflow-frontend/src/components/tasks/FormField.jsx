function FormField({
  label,
  helper,
  children,
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
        {label}
      </span>
      {children}
      {helper && (
        <span className="mt-1.5 block text-[11px] leading-4 text-slate-600">
          {helper}
        </span>
      )}
    </label>
  )
}

export default FormField
