import axios from "axios"

const API =
  import.meta.env.VITE_AUTH_API_URL ||
  "http://localhost:5000/api/auth"

export const registerAPI =
  async (userData) => {

    const response =
      await axios.post(
        `${API}/register`,
        userData
      )

    return response.data
}

export const loginAPI =
  async (userData) => {

    const response =
      await axios.post(
        `${API}/login`,
        userData
      )

    return response.data
}

export const googleLoginAPI =
  async (token) => {

    const response =
      await axios.post(
        `${API}/google`,
        {
          token,
        }
      )

    return response.data
}

export const updateProfileAPI =
  async (
    userData,
    token
  ) => {

    const response =
      await axios.put(

        `${API}/profile`,

        userData,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

    return response.data
}
