import { useEffect, useState } from 'react'
import { fetchCourses } from '../api'
import LoadingScreen from '../components/loading/LoadingScreen.jsx'

const CourseInventory = () => {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setError(null)
      try {
        const { data } = await fetchCourses()
        setInventory(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load inventory')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingScreen message="Loading inventory" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="badge">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Course Inventory</h1>
          <p className="text-sm text-slate-300">Overview of every course available in Skill Sync.</p>
        </div>
        <button className="primary-btn" onClick={() => window.location.reload()}>Refresh</button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {inventory.map((course) => (
          <div key={course.id || course.title} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                <p className="text-sm text-slate-300">Instructor: {course.instructor}</p>
              </div>
              <span className="badge">${Number(course.price || 0).toFixed(2)}</span>
            </div>
            <p className="mt-3 text-sm text-slate-200 line-clamp-3">{course.description}</p>
            <p className="mt-3 text-xs text-slate-400">Data sourced from courses API.</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseInventory
