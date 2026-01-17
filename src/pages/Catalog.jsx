import { useEffect, useState } from 'react'
import { enrollInCourse, fetchCourses } from '../api'
import LoadingScreen from '../components/loading/LoadingScreen.jsx'

const Catalog = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrollingId, setEnrollingId] = useState(null)
  const [notice, setNotice] = useState(null)

  const [search, setSearch] = useState('')
  const [priceSort, setPriceSort] = useState('none')
  useEffect(() => {
    const load = async () => {
      setError(null)
      setNotice(null)
      try {
        const { data } = await fetchCourses()
        setCourses(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load catalog')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleEnroll = async (courseId) => {
    setError(null)
    setNotice(null)
    setEnrollingId(courseId)
    try {
      await enrollInCourse(courseId)
      setNotice('Enrolled successfully')
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to enroll')
    } finally {
      setEnrollingId(null)
    }
  }

  if (loading) return <LoadingScreen message="Loading catalog" />

  const filtered = courses
    .filter((course) => {
      const term = search.toLowerCase()
      if (!term) return true
      return (
        course.title?.toLowerCase().includes(term) ||
        course.instructor?.toLowerCase().includes(term) ||
        course.description?.toLowerCase().includes(term)
      )
    })
    .sort((a, b) => {
      if (priceSort === 'low') return Number(a.price || 0) - Number(b.price || 0)
      if (priceSort === 'high') return Number(b.price || 0) - Number(a.price || 0)
      return 0
    })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="badge">Browse Catalog</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Find your next skill</h1>
          <p className="text-sm text-slate-300">Curated tracks tailored to your goals.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}
      {notice && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
          {notice}
        </div>
      )}

      <div className="glass-card flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between">
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none md:max-w-md"
          placeholder="Search by title, instructor, or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-300">Sort by price:</label>
          <select
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-indigo-400 focus:outline-none"
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
          >
            <option value="none">None</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((course) => (
          <div key={course.id || course.title} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                <p className="text-sm text-slate-300">Instructor: {course.instructor}</p>
              </div>
              <span className="badge">${Number(course.price || 0).toFixed(2)}</span>
            </div>
            <p className="mt-3 text-sm text-slate-200 line-clamp-3">{course.description}</p>
            <button
              className="primary-btn mt-4 w-full"
              onClick={() => handleEnroll(course.id)}
              disabled={enrollingId === course.id}
              type="button"
            >
              {enrollingId === course.id ? 'Enrolling…' : 'Enroll'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Catalog
