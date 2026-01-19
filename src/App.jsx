import { useState } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import useAuth from './hooks/useAuth.js'
import AdminCourseManager from './pages/AdminCourseManager.jsx'
import Catalog from './pages/Catalog.jsx'
import CourseInventory from './pages/CourseInventory.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EnrolledCourses from './pages/EnrolledCourses.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import Register from './pages/Register.jsx'
import UserManagement from './pages/UserManagement.jsx'

const AppShell = () => {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const displayName = user?.email ? user.email.split('@')[0] : 'Guest'

  return (
    <div className="flex min-h-screen text-slate-100">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex-1 md:ml-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-slate-900/70 px-4 py-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold"
              onClick={() => setMenuOpen((v) => !v)}
            >
              Menu
            </button>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Welcome</p>
              <p className="text-sm font-semibold text-white">{displayName}</p>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="enrolled" element={<EnrolledCourses />} />
        <Route path="catalog" element={<Catalog />} />

        <Route element={<ProtectedRoute allowRoles={['admin']} />}>
          <Route path="admin/courses" element={<AdminCourseManager />} />
          <Route path="admin/users" element={<UserManagement />} />
          <Route path="admin/inventory" element={<CourseInventory />} />
        </Route>
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default App
