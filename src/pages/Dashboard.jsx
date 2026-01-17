import { useEffect, useState } from 'react'
import { fetchCourses, fetchUsers, fetchMyEnrollments } from '../api'
import useAuth from '../hooks/useAuth.js'

const Dashboard = () => {
  const { role } = useAuth()
  const [courses, setCourses] = useState([])
  const [users, setUsers] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(true)
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true)
  const [error, setError] = useState(null)

  const highlights =
    role === 'admin'
      ? [
          'Monitor learner velocity and unblock cohorts fast.',
          'Push new course inventory without taking the site offline.',
          'Keep an eye on revenue surfaces with real-time alerts.',
        ]
      : [
          'Stay on track with your enrolled courses and due dates.',
          'Earn badges for finishing tracks and staying consistent.',
          'One-click enrollments with your recommended pathways.',
        ]

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await fetchCourses()
        setCourses(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        setError((prev) => prev || err?.response?.data?.message || 'Some data failed to load')
      } finally {
        setCoursesLoading(false)
      }
    }

    const loadUsers = async () => {
      if (role !== 'admin') {
        setUsers([])
        setUsersLoading(false)
        return
      }

      try {
        const res = await fetchUsers()
        setUsers(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        if (err?.response?.status !== 403) {
          setError((prev) => prev || err?.response?.data?.message || 'Some data failed to load')
        }
      } finally {
        setUsersLoading(false)
      }
    }

    const loadEnrollments = async () => {
      if (role === 'admin') {
        setEnrollments([])
        setEnrollmentsLoading(false)
        return
      }

      try {
        const res = await fetchMyEnrollments()
        setEnrollments(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        setError((prev) => prev || err?.response?.data?.message || 'Some data failed to load')
      } finally {
        setEnrollmentsLoading(false)
      }
    }

    loadCourses()
    loadUsers()
    loadEnrollments()
  }, [role])

  const totalCourses = courses.length
  const averagePrice = totalCourses
    ? (courses.reduce((sum, c) => sum + Number(c.price || 0), 0) / totalCourses).toFixed(2)
    : '0.00'
  const totalUsers = users.length
  const adminCount = users.filter((u) => String(u.role || '').toLowerCase().includes('admin')).length
  const learnerCount = Math.max(0, totalUsers - adminCount)

  const totalEnrollments = enrollments.length
  const completedEnrollments = enrollments.filter((e) => String(e.status || '').toLowerCase().includes('completed')).length
  const averageProgress = totalEnrollments
    ? Math.round(enrollments.reduce((sum, e) => sum + Number(e.progressPercent || 0), 0) / totalEnrollments)
    : 0
  const totalProgressPoints = enrollments.reduce((sum, e) => sum + Number(e.progressPercent || 0), 0)
  const overallProgress = Math.min(100, Math.round(totalProgressPoints))
  const overallStatus = overallProgress >= 100 ? 'Completed' : 'In progress'
  const nextDue = (() => {
    const dates = enrollments
      .map((e) => e.dueDate && new Date(e.dueDate))
      .filter((d) => d && !Number.isNaN(d.getTime()))
      .sort((a, b) => a - b)
    return dates[0] ? dates[0].toLocaleDateString() : '—'
  })()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="badge">{role === 'admin' ? 'Admin view' : 'Learner view'}</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Skill Sync Overview</h1>
          <p className="text-sm text-slate-300">Live metrics with background refresh.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {role === 'admin' ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm text-slate-400">Active Courses</p>
            <p className="mt-2 text-2xl font-semibold text-white">{coursesLoading ? '—' : totalCourses}</p>
            <p className="text-xs text-slate-400">Syncs automatically</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm text-slate-400">Average Course Price</p>
            <p className="mt-2 text-2xl font-semibold text-white">{coursesLoading ? '—' : `$${averagePrice}`}</p>
            <p className="text-xs text-slate-400">Based on current catalog</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm text-slate-400">Total Users</p>
            <p className="mt-2 text-2xl font-semibold text-white">{usersLoading ? '—' : totalUsers}</p>
            <p className="text-xs text-slate-400">Current directory</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm text-slate-400">Admins vs Learners</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {usersLoading ? '—' : `${adminCount} / ${learnerCount}`}
            </p>
            <p className="text-xs text-slate-400">Role breakdown</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm text-slate-400">My Enrollments</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {enrollmentsLoading ? '—' : totalEnrollments}
            </p>
            <p className="text-xs text-slate-400">Active courses for you</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm text-slate-400">Overall Progress</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {enrollmentsLoading ? '—' : `${overallProgress}%`}
            </p>
            <p className="text-xs text-slate-400">
              {enrollmentsLoading ? 'Calculating...' : `Status: ${overallStatus}`}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm text-slate-400">Completed</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {enrollmentsLoading ? '—' : completedEnrollments}
            </p>
            <p className="text-xs text-slate-400">Finished courses</p>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <p className="text-sm text-slate-400">Next Due</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {enrollmentsLoading ? '—' : nextDue}
            </p>
            <p className="text-xs text-slate-400">Upcoming milestone</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Current Initiatives</h2>
            <span className="badge">Live</span>
          </div>
          <div className="mt-4 space-y-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                <span className="mt-0.5 text-indigo-300">•</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
