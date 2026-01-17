import { createContext, useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import api, { setLogoutHandler } from '../api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'skillSyncToken'

const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token)
    return !exp || exp * 1000 < Date.now()
  } catch (err) {
    return true
  }
}

const normalizeRole = (roleClaim) => {
  if (!roleClaim) return 'user'

  const raw = Array.isArray(roleClaim) ? roleClaim[0] : roleClaim
  const lower = String(raw).toLowerCase()

  if (lower.includes('admin')) return 'admin'
  return 'user'
}

const parseUserFromToken = (token) => {
  try {
    const payload = jwtDecode(token)
    const email = payload.email || payload.sub
    const role = normalizeRole(payload.role || payload.roles || payload.auth)

    if (!email) return null

    return { email, role, token }
  } catch (err) {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [bootstrapping, setBootstrapping] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLogoutHandler(handleLogout)
    const token = localStorage.getItem(STORAGE_KEY)
    if (token && !isTokenExpired(token)) {
      const parsed = parseUserFromToken(token)
      if (parsed) {
        setUser(parsed)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    setBootstrapping(false)
  }, [])

  const handleLogin = async ({ email, password }) => {
    setSubmitting(true)
    setError(null)
    try {
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      const response = await api.post('/api/auth/login', { email, password })
      const { token } = response?.data || {}

      if (!token) {
        throw new Error('No token returned from server')
      }

      const parsed = parseUserFromToken(token)
      if (!parsed) {
        throw new Error('Invalid token payload')
      }

      localStorage.setItem(STORAGE_KEY, token)
      setUser(parsed)
    } catch (err) {
      setError(err.message || 'Unable to login right now')
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async ({ email, password }) => {
    setSubmitting(true)
    setError(null)
    try {
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      const response = await api.post('/api/auth/register', { email, password })
      const { token } = response?.data || {}

      if (!token) {
        throw new Error('No token returned from server')
      }

      const parsed = parseUserFromToken(token)
      if (!parsed) {
        throw new Error('Invalid token payload')
      }

      localStorage.setItem(STORAGE_KEY, token)
      setUser(parsed)
    } catch (err) {
      setError(err.message || 'Unable to register right now')
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      role: user?.role || 'guest',
      isAuthenticated: Boolean(user),
      bootstrapping,
      submitting,
      error,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      setError,
    }),
    [user, bootstrapping, submitting, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
