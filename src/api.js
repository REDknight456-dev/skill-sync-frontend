import axios from 'axios'

let logoutHandler

export const setLogoutHandler = (fn) => {
  logoutHandler = fn
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillSyncToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    if (status === 401 && typeof logoutHandler === 'function') {
      logoutHandler()
    }
    return Promise.reject(error)
  },
)

export const fetchCourses = () => api.get('/api/courses')
export const fetchCourse = (id) => api.get(`/api/courses/${id}`)
export const createCourse = (payload) => api.post('/api/courses', payload)
export const deleteCourse = (id) => api.delete(`/api/courses/${id}`)
export const fetchUsers = () => api.get('/api/users')

export const fetchMyEnrollments = async () => {
  try {
    return await api.get('/api/enrollments/me')
  } catch (err) {
    const status = err?.response?.status
    if (status === 403) {
      return { data: [] }
    }
    throw err
  }
}

export const enrollInCourse = (courseId) => api.post(`/api/enrollments/${courseId}`)

export const updateEnrollmentProgress = (enrollmentId, progressPercent) =>
  api.patch(`/api/enrollments/${enrollmentId}/progress`, { progressPercent })
export const downloadRevenueCsv = async () => {
  try {
    return await api.get('/api/revenue/export', { responseType: 'blob' })
  } catch (primaryError) {
    // Fallback to an alternative path if the primary export route is not available.
    return api.get('/api/revenue/csv', { responseType: 'blob' })
  }
}

export default api
