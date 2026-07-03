import axios from "axios"

const getToken = () => {
  try {
    localStorage.removeItem("taskflowUser")
    const storedUser = JSON.parse(sessionStorage.getItem("taskflowUser"))
    return storedUser?.token
  } catch {
    sessionStorage.removeItem("taskflowUser")
    localStorage.removeItem("taskflowUser")
    return null
  }
}

const API = import.meta.env.VITE_AI_API_URL || "http://localhost:5000/api/ai"

export const parseTaskFromText = async (text) => {
  const response = await axios.post(
    `${API}/parse-task`,
    { text },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  )
  return response.data
}

export const chatWithAssistant = async (message, tasks) => {
  const response = await axios.post(
    `${API}/chat`,
    { message, tasks },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  )
  return response.data
}
