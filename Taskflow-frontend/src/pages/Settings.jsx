import {
  Bell,
  Moon,
  Save,
  User,
} from "lucide-react"
import {
  useEffect,
  useState,
} from "react"
import toast from "react-hot-toast"

import DashboardLayout
  from "../layouts/DashboardLayout"
import {
  applyThemePreference,
  useAuth,
} from "../context/AuthContext"
import SelectField, {
  selectOptionClass,
} from "../components/ui/SelectField"

const getUserSettings = (authUser) => ({
  name:
    authUser?.user?.name || "",
  email:
    authUser?.user?.email || "",
  notificationsEnabled:
    authUser?.user
      ?.notificationsEnabled ?? true,
  reminderNotifications:
    authUser?.user
      ?.reminderNotifications ?? true,
  theme:
    authUser?.user?.theme || "dark",
})

function Toggle({
  enabled,
  onChange,
  disabled,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() =>
        onChange(!enabled)
      }
      className={`
        relative
        h-6
        w-11
        rounded-full
        transition
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${
          enabled
            ? "bg-sky-400"
            : "bg-slate-700"
        }
      `}
      aria-pressed={enabled}
    >
      <span
        className={`
          absolute
          top-1
          h-4
          w-4
          rounded-full
          bg-white
          shadow
          transition
          ${
            enabled
              ? "left-6"
              : "left-1"
          }
        `}
      />
    </button>
  )
}

function Settings() {
  const {
    user,
    updateUser,
  } = useAuth()

  const [
    form,
    setForm,
  ] = useState(() =>
    getUserSettings(user)
  )

  const [
    isSaving,
    setIsSaving,
  ] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(
      getUserSettings(user)
    )
  }, [user])

  const updateField =
    (field, value) => {
      setForm((current) => ({
        ...current,
        [field]: value,
      }))

      if (field === "theme") {
        localStorage.setItem(
          "taskflowTheme",
          value
        )
        applyThemePreference(value)
      }
    }

  const handleSave =
    async () => {
      if (isSaving) {
        return
      }

      try {
        setIsSaving(true)

        await updateUser({
          name: form.name.trim(),
          notificationsEnabled:
            Boolean(
              form.notificationsEnabled
            ),
          reminderNotifications:
            Boolean(
              form.reminderNotifications
            ),
          theme:
            form.theme || "dark",
        })

        toast.success(
          "Settings saved"
        )
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Failed to save settings"
        )
      } finally {
        setIsSaving(false)
      }
    }

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <div>

          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-sky-300">
            Preferences
          </p>

          <h1 className="text-4xl font-semibold text-white">
            Settings
          </h1>

          <p className="mt-2 text-slate-400">
            Manage your account preferences and workspace experience.
          </p>

        </div>

        <div className="grid gap-6">

          <section
            className="
              rounded-[2rem]
              border
              border-white/[0.08]
              bg-white/[0.05]
              p-6
              backdrop-blur-2xl
            "
          >

            <div className="mb-6 flex items-center gap-3">

              <div className="rounded-2xl bg-sky-400/10 p-3 text-sky-300">
                <User size={22} />
              </div>

              <div>

                <h2 className="text-xl font-semibold text-white">
                  Account
                </h2>

                <p className="text-sm text-slate-400">
                  Personal profile information
                </p>

              </div>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  disabled={isSaving}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-black/20
                    px-4
                    py-3
                    text-white
                    outline-none
                    transition
                    disabled:opacity-60
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Email
                </label>

                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/[0.08]
                    bg-black/20
                    px-4
                    py-3
                    text-white
                    outline-none
                    opacity-70
                  "
                />
              </div>

            </div>

          </section>

          <section
            className="
              rounded-[2rem]
              border
              border-white/[0.08]
              bg-white/[0.05]
              p-6
              backdrop-blur-2xl
            "
          >

            <div className="mb-6 flex items-center gap-3">

              <div className="rounded-2xl bg-violet-400/10 p-3 text-violet-300">
                <Bell size={22} />
              </div>

              <div>

                <h2 className="text-xl font-semibold text-white">
                  Notifications
                </h2>

                <p className="text-sm text-slate-400">
                  Control reminders and alerts
                </p>

              </div>

            </div>

            <div className="space-y-4">

              <div className="flex items-center justify-between gap-4 rounded-2xl bg-black/20 p-4 ring-1 ring-white/[0.05]">

                <div>
                  <p className="font-medium text-white">
                    Email Notifications
                  </p>

                  <p className="text-sm text-slate-400">
                    Receive updates by email
                  </p>
                </div>

                <Toggle
                  enabled={
                    form.notificationsEnabled
                  }
                  disabled={isSaving}
                  onChange={(value) =>
                    updateField(
                      "notificationsEnabled",
                      value
                    )
                  }
                />

              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl bg-black/20 p-4 ring-1 ring-white/[0.05]">

                <div>
                  <p className="font-medium text-white">
                    Task Reminders
                  </p>

                  <p className="text-sm text-slate-400">
                    Enable reminder alerts
                  </p>
                </div>

                <Toggle
                  enabled={
                    form.reminderNotifications
                  }
                  disabled={
                    isSaving ||
                    !form.notificationsEnabled
                  }
                  onChange={(value) =>
                    updateField(
                      "reminderNotifications",
                      value
                    )
                  }
                />

              </div>

            </div>

          </section>

          <section
            className="
              rounded-[2rem]
              border
              border-white/[0.08]
              bg-white/[0.05]
              p-6
              backdrop-blur-2xl
            "
          >

            <div className="mb-6 flex items-center gap-3">

              <div className="rounded-2xl bg-amber-400/10 p-3 text-amber-300">
                <Moon size={22} />
              </div>

              <div>

                <h2 className="text-xl font-semibold text-white">
                  Appearance
                </h2>

                <p className="text-sm text-slate-400">
                  Customize workspace theme
                </p>

              </div>

            </div>

            <div className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/[0.05]">

              <p className="font-medium text-white">
                Theme
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Choose the workspace appearance used across TaskFlow.
              </p>

              <SelectField
                value={form.theme}
                disabled={isSaving}
                wrapperClassName="mt-4"
                onChange={(event) =>
                  updateField(
                    "theme",
                    event.target.value
                  )
                }
                className="rounded-2xl"
              >

                <option value="dark" className={selectOptionClass}>
                  Dark
                </option>

                <option value="light" className={selectOptionClass}>
                  Light
                </option>

                <option value="system" className={selectOptionClass}>
                  System
                </option>

              </SelectField>

            </div>

          </section>

        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={
            isSaving ||
            !form.name.trim()
          }
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-white
            px-6
            py-3
            text-sm
            font-semibold
            text-slate-950
            transition
            hover:bg-slate-100
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Save size={16} />
          {isSaving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>

    </DashboardLayout>
  )
}

export default Settings
