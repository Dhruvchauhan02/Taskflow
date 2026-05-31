/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  createTaskAPI,
  deleteTaskAPI,
  fetchTasks,
  updateTaskAPI,
} from "../services/taskService"
import {
  useAuth,
} from "./AuthContext"

const TaskContext =
  createContext()

export const TaskProvider =
  ({ children }) => {
    const { user } =
      useAuth()

    const token =
      user?.token

    const [tasks, setTasks] =
      useState([])

    const [loading, setLoading] =
      useState(Boolean(token))

    const loadTasks =
      useCallback(
        async () => {
          if (!token) {
            setTasks([])
            setLoading(false)
            return
          }

          try {
            setLoading(true)

            const data =
              await fetchTasks()

            setTasks(data)
          } catch (error) {
            console.error(error)
            setTasks([])
          } finally {
            setLoading(false)
          }
        },
        [token]
      )

    useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadTasks()
    }, [loadTasks])

    const createTask =
      useCallback(
        async (taskData) => {
          if (!token) {
            throw new Error(
              "Authentication required"
            )
          }

          const newTask =
            await createTaskAPI(
              taskData
            )

          setTasks((prev) => [
            newTask,
            ...prev,
          ])

          return newTask
        },
        [token]
      )

    const updateTask =
      useCallback(
        async (
          id,
          updatedData
        ) => {
          if (!token) {
            throw new Error(
              "Authentication required"
            )
          }

          const updatedTask =
            await updateTaskAPI(
              id,
              updatedData
            )

          setTasks((prev) =>
            prev.map((task) =>
              task._id === id
                ? updatedTask
                : task
            )
          )

          return updatedTask
        },
        [token]
      )

    const deleteTask =
      useCallback(
        async (id) => {
          if (!token) {
            throw new Error(
              "Authentication required"
            )
          }

          await deleteTaskAPI(id)

          setTasks((prev) =>
            prev.filter(
              (task) =>
                task._id !== id
            )
          )
        },
        [token]
      )

    const value =
      useMemo(
        () => ({
          tasks,
          setTasks,
          loading,
          createTask,
          updateTask,
          deleteTask,
          loadTasks,
        }),
        [
          tasks,
          loading,
          createTask,
          updateTask,
          deleteTask,
          loadTasks,
        ]
      )

    return (
      <TaskContext.Provider
        value={value}
      >
        {children}
      </TaskContext.Provider>
    )
  }

export const useTasks =
  () => {
    const context =
      useContext(
        TaskContext
      )

    if (!context) {
      throw new Error(
        "useTasks must be used within TaskProvider"
      )
    }

    return context
  }
