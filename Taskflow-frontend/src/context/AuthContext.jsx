/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  updateProfileAPI,
} from "../services/authService"

const AuthContext =
  createContext()

const defaultUserSettings = {
  notificationsEnabled: true,
  reminderNotifications: true,
  theme: "dark",
}

const userStorageKey =
  "taskflowUser"

export const applyThemePreference = (theme = "dark") => {
  const root =
    document.documentElement

  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches

  const resolvedTheme =
    theme === "system"
      ? prefersDark
        ? "dark"
        : "light"
      : theme

  root.classList.remove(
    "dark",
    "light"
  )
  root.classList.add(
    resolvedTheme
  )
  root.dataset.theme =
    resolvedTheme
  root.dataset.themePreference =
    theme
  root.style.colorScheme =
    resolvedTheme
}

const normalizeAuthData = (authData) => {
  if (!authData?.user) {
    return null
  }

  return {
    ...authData,
    user: {
      ...defaultUserSettings,
      ...authData.user,
    },
  }
}

const readStoredUser = () => {
  try {
    localStorage.removeItem(
      userStorageKey
    )

    const storedUser =
      sessionStorage.getItem(
        userStorageKey
      )

    return storedUser
      ? normalizeAuthData(
          JSON.parse(storedUser)
        )
      : null
  } catch {
    sessionStorage.removeItem(
      userStorageKey
    )
    localStorage.removeItem(
      userStorageKey
    )
    return null
  }
}

export const AuthProvider =
  ({ children }) => {

    const [user, setUser] =
      useState(readStoredUser)

    const login = (
      userData
    ) => {
      const nextUser =
        normalizeAuthData(
          userData
        )

      if (!nextUser) {
        throw new Error(
          "Invalid authentication response"
        )
      }

      localStorage.removeItem(
        userStorageKey
      )

      sessionStorage.setItem(
        userStorageKey,
        JSON.stringify(
          nextUser
        )
      )

      localStorage.setItem(
        "taskflowTheme",
        nextUser.user.theme
      )

      applyThemePreference(
        nextUser.user.theme
      )

      setUser(nextUser)
    }

    const logout = () => {

      sessionStorage.removeItem(
        userStorageKey
      )

      localStorage.removeItem(
        userStorageKey
      )

      localStorage.removeItem(
        "taskflowTheme"
      )

      applyThemePreference("dark")

      setUser(null)
    }

    const updateUser =
    async (updatedData) => {

      const updatedUser =
        await updateProfileAPI(

          updatedData,

          user?.token
        )

      const newUserData =
        normalizeAuthData({

        ...user,

        user: updatedUser.user,
      })

      if (!newUserData) {
        throw new Error(
          "Invalid profile response"
        )
      }

      localStorage.removeItem(
        userStorageKey
      )

      sessionStorage.setItem(
        userStorageKey,

        JSON.stringify(
          newUserData
        )
      )

      localStorage.setItem(
        "taskflowTheme",
        newUserData.user.theme
      )

      applyThemePreference(
        newUserData.user.theme
      )

      setUser(newUserData)

      return newUserData
  }

    useEffect(() => {
      const theme =
        user?.user?.theme ||
        localStorage.getItem(
          "taskflowTheme"
        ) ||
        "dark"

      localStorage.setItem(
        "taskflowTheme",
        theme
      )

      applyThemePreference(theme)

      if (theme !== "system") {
        return undefined
      }

      const mediaQuery =
        window.matchMedia(
          "(prefers-color-scheme: dark)"
        )

      const handleSystemThemeChange =
        () => applyThemePreference("system")

      mediaQuery.addEventListener(
        "change",
        handleSystemThemeChange
      )

      return () => {
        mediaQuery.removeEventListener(
          "change",
          handleSystemThemeChange
        )
      }
    }, [user?.user?.theme])

    return (
      <AuthContext.Provider
        value={{
          user,
          login,
          logout,
          updateUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
}

export const useAuth =
  () =>
    useContext(
      AuthContext
    )
