import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, verifyTwoFactor, twoFactorPending, submitting, error, setError } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [twoFactorOpen, setTwoFactorOpen] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await login(form)
      if (result?.requires2fa) {
        setTwoFactorOpen(true)
        return
      }

      const redirect = location.state?.from?.pathname || '/'
      navigate(redirect, { replace: true })
    } catch (err) {
      /* error handled in context */
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    try {
      await verifyTwoFactor({ code: twoFactorCode })
      const redirect = location.state?.from?.pathname || '/'
      navigate(redirect, { replace: true })
    } catch (err) {
      /* error handled in context */
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card w-full max-w-xl rounded-3xl p-10 shadow-xl shadow-indigo-500/15">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
            <p className="text-sm text-slate-300">Sign in to continue to Skill Sync Dashboard</p>
          </div>
          <div className="hidden md:block rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-400/10 p-4 text-4xl">🔐</div>
        </div>
        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
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
          <button type="submit" className="primary-btn w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-300">
          New here?{' '}
          <Link className="text-indigo-300 hover:text-indigo-200" to="/register">
            Create an account
          </Link>
        </p>
      </div>

      {twoFactorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="glass-card w-full max-w-md rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">2FA verification</h3>
              <span className="badge">Email code</span>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Enter the verification code we just emailed you to finish signing in.
            </p>
            {error && (
              <div className="mt-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-100">
                {error}
              </div>
            )}
            <form className="mt-4 space-y-3" onSubmit={handleVerify}>
              <div>
                <label className="block text-sm font-semibold text-slate-200">Code</label>
                <input
                  name="twoFactorCode"
                  value={twoFactorCode}
                  onChange={(e) => {
                    setTwoFactorCode(e.target.value)
                    if (error) setError(null)
                  }}
                  placeholder="123456"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setTwoFactorOpen(false)
                    setTwoFactorCode('')
                    setError(null)
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn" disabled={submitting || !twoFactorPending}>
                  {submitting ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
