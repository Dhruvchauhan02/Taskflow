import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from "react-hot-toast"
import {
  AuthProvider
} from "./context/AuthContext"
import {
  TaskProvider
} from "./context/TaskContext"
import {
  GoogleOAuthProvider,
} from "@react-oauth/google"
ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
  <GoogleOAuthProvider
    clientId="550359813907-pa86kgmmq3e4s0nsk2qpg1rflj55tjcp.apps.googleusercontent.com"
  >

    <AuthProvider>
      <TaskProvider>

      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
        }}
      />
      </TaskProvider>

    </AuthProvider>

  </GoogleOAuthProvider>
</React.StrictMode>,
)
