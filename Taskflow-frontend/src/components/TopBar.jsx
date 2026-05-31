import {
  Bell,
  ChevronDown,
  Command,
  LogOut,
  Plus,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react"
import { Link }
  from "react-router-dom"

import { useState }
  from "react"
import { useAuth }
  from "../context/AuthContext"
function TopBar() {
  const [isMenuOpen,
    setIsMenuOpen]
    = useState(false)
  const { user, logout } =
  useAuth()
  return (
    <header
      className="
        sticky
        top-4
        z-30
        mb-8
        flex
        items-center
        gap-3
        rounded-[1.5rem]
        bg-white/[0.055]
        p-2
        shadow-2xl
        shadow-black/15
        ring-1
        ring-white/[0.08]
        backdrop-blur-xl
      "
    >
      <label className="relative hidden flex-1 md:block">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          className="
            h-11
            w-full
            rounded-[1.15rem]
            bg-black/[0.18]
            pl-10
            pr-24
            text-sm
            text-slate-200
            outline-none
            ring-1
            ring-white/[0.06]
            transition
            placeholder:text-slate-500
            focus:bg-black/25
            focus:ring-white/15
          "
          placeholder="Search workspace..."
          type="search"
        />
        <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg bg-white/[0.07] px-2 py-1 text-[11px] text-slate-500 ring-1 ring-white/[0.06] lg:flex">
          <Command size={11} />
          K
        </span>
      </label>

      <button
        className="
          inline-flex
          h-11
          items-center
          justify-center
          gap-2
          rounded-[1.15rem]
          bg-white/[0.08]
          px-3
          text-sm
          font-medium
          text-slate-200
          ring-1
          ring-white/[0.08]
          transition
          hover:-translate-y-0.5
          hover:bg-white/[0.12]
          hover:text-white
        "
      >
        <Sparkles size={16} />
        <span className="hidden sm:inline">Ask AI</span>
      </button>

      <Link
        to="/tasks"
        className="
          inline-flex
          h-11
          items-center
          justify-center
          gap-2
          rounded-[1.15rem]
          bg-white
          px-3
          text-sm
          font-semibold
          text-slate-950
          shadow-lg
          shadow-white/10
          transition
          hover:-translate-y-0.5
          hover:bg-slate-100
        "
      >
        <Plus size={16} />
        <span className="hidden sm:inline">New</span>
      </Link>

      <button
        className="
          hidden
          h-11
          w-11
          items-center
          justify-center
          rounded-[1.15rem]
          bg-white/[0.07]
          text-slate-300
          ring-1
          ring-white/[0.08]
          transition
          hover:bg-white/[0.11]
          hover:text-white
          sm:inline-flex
        "
        aria-label="Notifications"
      >
        <Bell size={16} />
      </button>
    <div className="relative">

    <button
      onClick={() =>
        setIsMenuOpen(
          !isMenuOpen
        )
      }

      className="
        flex
        items-center
        gap-3
        rounded-[1.25rem]
        bg-white/[0.05]
        px-3
        py-2
        ring-1
        ring-white/[0.07]
        backdrop-blur-xl
        transition
        hover:bg-white/[0.08]
      "
    >

      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-gradient-to-br
          from-sky-400
          to-violet-400
          text-sm
          font-semibold
          text-white
        "
      >
        {user?.user?.name
          ?.charAt(0)
          ?.toUpperCase()}
      </div>

      <div className="hidden sm:block text-left">
        <p className="text-sm font-medium text-white">
          {user?.user?.name}
        </p>

        <p className="text-xs text-slate-400">
          {user?.user?.email}
        </p>
      </div>

      <ChevronDown
        size={16}
        className="
          text-slate-400
        "
      />

    </button>

    {isMenuOpen && (

    <div
        className="
          absolute
          right-0
          top-16
          w-56
          overflow-hidden
          rounded-[1.5rem]
          border
          border-white/[0.08]
          bg-[#0B1120]/95
          shadow-2xl
          shadow-black/30
          backdrop-blur-2xl
        "
      >

        <div className="border-b border-white/[0.06] p-4">

          <p className="text-sm font-medium text-white">
            {user?.user?.name}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {user?.user?.email}
          </p>

        </div>

        <div className="p-2">

          <Link
            to="/profile"
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              text-slate-300
              transition
              hover:bg-white/[0.06]
              hover:text-white
            "
          >
            <User size={16} />
            Profile
          </Link>

          <Link
            to="/settings"
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              text-slate-300
              transition
              hover:bg-white/[0.06]
              hover:text-white
            "
          >
            <Settings size={16} />
            Settings
          </Link>

          <button
            onClick={logout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-sm
              text-red-300
              transition
              hover:bg-red-400/10
            "
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>

      </div>

    )}

  </div>
    </header>
  )
}

export default TopBar
