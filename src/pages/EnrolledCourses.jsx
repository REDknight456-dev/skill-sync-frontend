import { useEffect, useMemo, useState } from 'react'
import { fetchMyEnrollments, updateEnrollmentProgress } from '../api'
import LoadingScreen from '../components/loading/LoadingScreen.jsx'

const EnrolledCourses = () => {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [savingProgress, setSavingProgress] = useState(false)

  useEffect(() => {
    const load = async () => {
      setError(null)
      try {
        const { data } = await fetchMyEnrollments()
        setEnrollments(Array.isArray(data) ? data : [])
      } catch (err) {
        if (err?.response?.status === 403) {
          // Treat forbidden as no enrollments instead of surfacing an error banner.
          setEnrollments([])
          setError(null)
        } else {
          setError(err?.response?.data?.message || 'Unable to load enrollments')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const averageProgress = useMemo(() => {
    if (!enrollments.length) return 0
    const total = enrollments.reduce((sum, item) => sum + Number(item.progressPercent || 0), 0)
    return Math.round(total / enrollments.length)
  }, [enrollments])

  if (loading) return <LoadingScreen message="Loading enrollments" />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="badge">Learner</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">My Enrollments</h1>
          <p className="text-sm text-slate-300">Average progress: {averageProgress}%</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {!error && enrollments.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
          No enrollments yet. Enroll from the catalog to see them here.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {enrollments.map((item) => {
          const progress = Math.min(100, Math.max(0, Number(item.progressPercent || 0)))
          const course = item.course || {}
          const displayStatus = progress >= 100 ? 'Completed' : item.status || 'In progress'

          return (
            <button
              key={item.id || course.id || course.title}
              className="glass-card rounded-2xl p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/15"
              onClick={() => setSelected(item)}
              type="button"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{course.title || 'Course'}</h3>
                  <p className="text-sm text-slate-300">{course.instructor || 'Instructor'}</p>
                </div>
                <span className="badge">{displayStatus}</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {item.dueDate && (
                  <p className="mt-2 text-xs text-slate-400">Due {new Date(item.dueDate).toLocaleDateString()}</p>
                )}
              </div>
              {course.description && (
                <p className="mt-3 text-xs text-slate-400 line-clamp-2">{course.description}</p>
              )}
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="glass-card w-full max-w-xl rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="badge mb-2">Enrollment</p>
                <h3 className="text-xl font-semibold text-white">{selected.course?.title || 'Course detail'}</h3>
                <p className="text-sm text-slate-300">{selected.course?.instructor}</p>
              </div>
              <button className="secondary-btn px-3" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-200">
              {selected.course?.description && <p>{selected.course.description}</p>}
              <p>
                Status:{' '}
                <span className="text-indigo-200">
                  {selected.progressPercent >= 100 ? 'Completed' : selected.status || 'In progress'}
                </span>
              </p>
              <div>
                <p className="mb-2">Progress</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.min(100, Math.max(0, Number(selected.progressPercent || 0)))}
                  onChange={(e) =>
                    setSelected((prev) => ({ ...prev, progressPercent: Number(e.target.value) }))
                  }
                  className="w-full"
                />
                <p className="text-xs text-slate-300">{Math.min(100, Math.max(0, Number(selected.progressPercent || 0)))}%</p>
                <button
                  className="primary-btn mt-3"
                  disabled={savingProgress}
                  onClick={async () => {
                    setSavingProgress(true)
                    try {
                      await updateEnrollmentProgress(selected.id, Number(selected.progressPercent || 0))
                      setEnrollments((prev) =>
                        prev.map((e) => (e.id === selected.id ? { ...e, progressPercent: selected.progressPercent } : e)),
                      )
                    } catch (err) {
                      alert(err?.response?.data?.message || 'Unable to update progress')
                    } finally {
                      setSavingProgress(false)
                    }
                  }}
                  type="button"
                >
                  {savingProgress ? 'Saving…' : 'Save progress'}
                </button>
              </div>
              {selected.createdAt && <p>Enrolled: {new Date(selected.createdAt).toLocaleDateString()}</p>}
              {selected.dueDate && <p>Due: {new Date(selected.dueDate).toLocaleDateString()}</p>}
              {selected.course?.price !== undefined && (
                <p>Price: ${Number(selected.course.price || 0).toFixed(2)}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnrolledCourses
