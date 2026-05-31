import { useState } from "react"
import { motion } from "framer-motion"

import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"

import { Menu } from "lucide-react"

function DashboardLayout({ children }) {

  const [isOpen, setIsOpen] =
    useState(false)

  return (
    <div
      className="
        relative
        flex
        min-h-screen
        overflow-hidden
        text-slate-50
      "
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="ambient-orb absolute left-[-9rem] top-[-12rem] h-80 w-80 rounded-full bg-sky-300/[0.09] blur-3xl" />
        <div className="ambient-orb ambient-orb-slow absolute right-[-12rem] top-20 h-96 w-96 rounded-full bg-violet-300/[0.08] blur-3xl" />
        <div className="ambient-orb absolute bottom-[-10rem] left-1/3 h-72 w-72 rounded-full bg-teal-200/[0.07] blur-3xl" />
      </div>

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {isOpen && (
        <button
          aria-label="Close sidebar overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <main
      className="
        relative
        z-10
        flex-1
        px-4
        py-5
        sm:px-6
        lg:ml-60
        lg:px-8
        lg:py-5
      "
    >

        <button
          onClick={() =>
            setIsOpen(true)
          }
          className="
            lg:hidden
            mb-4
            inline-flex
            h-10
            w-10
            items-center
            justify-center
            rounded-[1.15rem]
            bg-white/[0.08]
            text-white
            ring-1
            ring-white/[0.08]
            backdrop-blur-xl
            transition
            hover:bg-white/[0.12]
          "
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <TopBar />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {children}
        </motion.div>

      </main>

    </div>
  )
}

export default DashboardLayout
