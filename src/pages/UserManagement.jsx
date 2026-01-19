import { useEffect, useState } from 'react'
import { fetchUsers } from '../api'
import LoadingScreen from '../components/loading/LoadingScreen.jsx'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setError(null)
      try {
        const { data } = await fetchUsers()
        setUsers(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load users')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <LoadingScreen message="Loading users" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="badge">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">User Management</h1>
          <p className="text-sm text-slate-300">Read-only list from the users API.</p>
        </div>
        <button className="primary-btn" onClick={() => window.location.reload()}>Refresh</button>
      </div>
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}
      <div className="glass-card overflow-hidden rounded-2xl">
        <table className="min-w-full text-sm text-slate-100">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
            <tr>
              <th className="px-4 py-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="border-t border-white/5">
                <td className="px-4 py-3 font-semibold text-white">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserManagement
