import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"

import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* PUBLIC */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROTECTED */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>

              <Tasks />

            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>

              <Profile />

            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>

              <Settings />

            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate to="/" />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App