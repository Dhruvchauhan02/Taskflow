import {
  LayoutDashboard,
  CheckSquare,
  User,
  X,
  Sparkles,
  Circle,
  Home,
} from "lucide-react"

import { NavLink } from "react-router-dom"
import { useAuth }
  from "../context/AuthContext"
const links = [
  {
    to: "/",
    label: "Home",
    icon: Home,
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/tasks",
    label: "Tasks",
    icon: CheckSquare,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: User,
  },
]

function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } =
  useAuth()
  return (

    <aside
      className={`
        fixed
        left-0
        top-0
        z-50
        h-screen
        w-60
        p-3
        text-white
        transform
        transition-transform
        duration-500
        ease-out

        ${isOpen
          ? "translate-x-0"
          : "-translate-x-full"}

        lg:translate-x-0
        lg:fixed
      `}
    >
      <div
        className="
          flex
          h-full
          flex-col
          rounded-[1.6rem]
          bg-white/[0.045]
          p-3
          shadow-2xl
          shadow-black/20
          ring-1
          ring-white/[0.07]
          backdrop-blur-xl
        "
      >

      <div
        className="
          flex
          items-center
          justify-between
          px-1.5
          pb-6
          pt-1
        "
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              bg-white/[0.92]
              text-slate-950
              shadow-md
              shadow-white/5
            "
          >
            <Sparkles size={16} />
          </div>

          <div className="min-w-0">
            <h1
              className="
                text-base
                font-semibold
                tracking-tight
              "
            >
              TaskFlow
            </h1>

            <p className="truncate text-[11px] text-slate-500">
              Focus workspace
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setIsOpen(false)
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            text-slate-300
            transition
            hover:bg-white/10
            hover:text-white
            lg:hidden
          "
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>

      </div>

      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `
                group
                flex
                items-center
                gap-2.5
                rounded-[1rem]
                px-3
                py-2.5
                text-[13px]
                font-medium
                transition
                duration-300
                ${
                  isActive
                    ? "bg-white/[0.92] text-slate-950 shadow-md shadow-white/5"
                    : "text-slate-400 hover:bg-white/[0.07] hover:text-slate-100"
                }
              `
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-[1.25rem] bg-black/[0.14] p-3 ring-1 ring-white/[0.06]">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-slate-400">
          <Circle size={8} className="fill-emerald-300 text-emerald-300" />
          System calm
        </div>
        <p className="text-xs leading-5 text-slate-500">
          A cleaner command center for planning, tracking, and finishing work.
        </p>
      </div>

      <div className="flex items-center gap-2">

      {!user ? (

        <NavLink
          to="/login"
          onClick={() =>
            setIsOpen(false)
          }
          className="
            inline-flex
            flex-1
            items-center
            justify-center
            rounded-[1rem]
            bg-white/[0.08]
            px-3
            py-2.5
            text-sm
            font-medium
            text-slate-200
            ring-1
            ring-white/[0.08]
            transition
            hover:bg-white/[0.12]
          "
        >
          Login
        </NavLink>

      ) : (

        <button
          onClick={() => {

            logout()

            setIsOpen(false)
          }}

          className="
            inline-flex
            flex-1
            items-center
            justify-center
            rounded-[1rem]
            bg-white/[0.92]
            px-3
            py-2.5
            text-sm
            font-semibold
            text-slate-950
            transition
            hover:bg-slate-100
          "
        >
          Logout
        </button>

      )}

    </div>

      </div>

    </aside>
  )
}

export default Sidebar
