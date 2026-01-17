import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'
import LoadingScreen from './loading/LoadingScreen.jsx'

const ProtectedRoute = ({ allowRoles }) => {
  const { isAuthenticated, role, bootstrapping } = useAuth()
  const location = useLocation()

  if (bootstrapping) {
    return <LoadingScreen message="Validating session" />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowRoles && !allowRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
