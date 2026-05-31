function TaskSkeleton() {
  return (
    <div className="rounded-[1.45rem] bg-white/[0.045] p-4 ring-1 ring-white/[0.06]">
      <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/[0.08]" />
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-20 animate-pulse rounded-full bg-white/[0.06]" />
        <div className="h-6 w-16 animate-pulse rounded-full bg-white/[0.05]" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-3 animate-pulse rounded-full bg-white/[0.05]" />
        <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/[0.04]" />
      </div>
    </div>
  )
}

export default TaskSkeleton
