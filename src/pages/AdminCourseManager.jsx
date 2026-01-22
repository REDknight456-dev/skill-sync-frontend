import { useEffect, useMemo, useState } from 'react'
import { createCourse, deleteCourse, fetchCourses, updateCourse } from '../api'
import LoadingScreen from '../components/loading/LoadingScreen.jsx'

const AdminCourseManager = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({ title: '', description: '', instructor: '', price: '' })

  const loadCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await fetchCourses()
      setCourses(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const openForNew = () => {
    setDraft({ title: '', description: '', instructor: '', price: '' })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openForEdit = (course) => {
    setDraft({
      title: course.title || '',
      description: course.description || '',
      instructor: course.instructor || '',
      price: course.price ?? '',
    })
    setEditingId(course.id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
  }

  const handleChange = (e) => {
    const value = e.target.name === 'price' ? Number(e.target.value) : e.target.value
    setDraft((prev) => ({ ...prev, [e.target.name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!draft.title || !draft.instructor) return

    try {
      setSuccess(null)
      if (editingId) {
        const { data } = await updateCourse(editingId, draft)
        setCourses((prev) => prev.map((c) => (c.id === editingId ? data : c)))
        setSuccess('Course updated successfully')
      } else {
        const { data } = await createCourse(draft)
        setCourses((prev) => [...prev, data])
        setSuccess('Course created successfully')
      }
      setIsModalOpen(false)
      setEditingId(null)
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save course')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id)
      setCourses((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete course')
    }
  }

  const totalPrice = useMemo(
    () => courses.reduce((sum, c) => sum + Number(c.price || 0), 0),
    [courses],
  )

  const averagePrice = useMemo(
    () => (courses.length ? Math.round((totalPrice / courses.length) * 100) / 100 : 0),
    [courses, totalPrice],
  )

  if (loading) return <LoadingScreen message="Loading courses" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="badge">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Course Manager</h1>
          <p className="text-sm text-slate-300">Manage inventory, seats, and availability.</p>
        </div>
        <div className="flex gap-2">
          <button className="secondary-btn" onClick={loadCourses}>Refresh</button>
          <button className="primary-btn" onClick={openForNew}>Add new course</button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {success}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-card rounded-2xl p-4">
          <p className="text-sm text-slate-300">Total courses</p>
          <p className="text-2xl font-semibold text-white">{courses.length}</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
            <p className="text-sm text-slate-300">Average price</p>
            <p className="text-2xl font-semibold text-white">${averagePrice.toFixed(2)}</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
            <p className="text-sm text-slate-300">Total catalog value</p>
            <p className="text-2xl font-semibold text-white">${totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-slate-100">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Instructor</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t border-white/5">
                  <td className="px-4 py-3 font-semibold text-white">{course.title}</td>
                  <td className="px-4 py-3 text-slate-300">{course.instructor}</td>
                  <td className="px-4 py-3 text-slate-200">${Number(course.price || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-300 line-clamp-2">{course.description}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="secondary-btn px-3" onClick={() => openForEdit(course)}>
                        Edit
                      </button>
                      <button className="secondary-btn px-3" onClick={() => handleDelete(course.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="glass-card w-full max-w-lg rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                {editingId ? 'Edit course' : 'Add new course'}
              </h3>
              <button className="secondary-btn px-3" onClick={closeModal}>
                Close
              </button>
            </div>
            <form className="mt-4 space-y-4" onSubmit={handleSave}>
              <div>
                <label className="block text-sm font-semibold text-slate-200">Title</label>
                <input
                  name="title"
                  value={draft.title}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-indigo-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-200">Instructor</label>
                <input
                  name="instructor"
                  value={draft.instructor}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-indigo-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-200">Description</label>
                <textarea
                  name="description"
                  value={draft.description}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-indigo-400 focus:outline-none"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-200">Price</label>
                <input
                  type="number"
                  name="price"
                  min={0}
                  step={0.01}
                  value={draft.price}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-indigo-400 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="secondary-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {editingId ? 'Save changes' : 'Create course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCourseManager
