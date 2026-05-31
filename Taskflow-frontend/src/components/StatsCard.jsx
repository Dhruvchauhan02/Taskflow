import { motion } from "framer-motion"

function StatsCard({ title, count, icon: Icon, accent = "from-sky-300/35 to-cyan-300/10" }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      whileHover={{
        y: -6,
      }}

      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className="
        group
        relative
        overflow-hidden
        backdrop-blur-lg
        bg-white/[0.055]
        rounded-[1.35rem]
        p-4
        shadow-xl
        shadow-black/10
        ring-1
        ring-white/[0.07]
        transition
        duration-300
      "
    >
      <div
        className={`
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          ${accent}
        `}
      />
      <div
        className={`
          absolute
          -right-12
          -top-12
          h-36
          w-36
          rounded-full
          bg-gradient-to-br
          ${accent}
          blur-3xl
          transition
          duration-500
          group-hover:opacity-80
        `}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <h3
            className="
              text-sm
              font-medium
              text-slate-400
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-4
              text-4xl
              font-semibold
              tracking-tight
              text-white
            "
          >
            {count}
          </p>
        </div>

        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] bg-white/[0.07] text-slate-300 ring-1 ring-white/[0.07]">
            <Icon size={18} />
          </div>
        )}
      </div>

    </motion.div>
  )
}

export default StatsCard
