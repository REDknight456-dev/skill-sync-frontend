import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

const Register = () => {
  const navigate = useNavigate()
  const { register, submitting, error, setError } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      /* handled upstream */
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card w-full max-w-2xl rounded-3xl p-10 shadow-xl shadow-indigo-500/15">
        <p className="badge mb-6 w-fit">Create Account</p>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Join Skill Sync</h1>
            <p className="text-sm text-slate-300">Register to track skills and manage learning journeys.</p>
          </div>
          <div className="hidden md:block rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/10 p-4 text-4xl">🚀</div>
        </div>
        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-200">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-200">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="primary-btn md:col-span-2" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-300">
          Already registered?{' '}
          <Link className="text-indigo-300 hover:text-indigo-200" to="/login">
            Back to login
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-slate-400">
          Roles are assigned by admins after sign-up.
        </p>
      </div>
    </div>
  )
}

export default Register
