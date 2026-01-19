import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

const LinkItem = ({ to, label, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
        isActive
          ? 'bg-white/10 text-white ring-1 ring-white/20'
          : 'text-slate-200 hover:bg-white/5 hover:text-white'
      }`
    }
  >
    <span className="text-lg opacity-70 group-hover:opacity-100">{icon}</span>
    <span>{label}</span>
  </NavLink>
)

const Sidebar = ({ open, onClose }) => {
  const { role, logout } = useAuth()

  const commonLinks = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/profile', label: 'My Profile', icon: '🙋' },
  ]

  const learnerLinks = [
    { to: '/enrolled', label: 'My Enrolled Courses', icon: '🎓' },
    { to: '/catalog', label: 'Browse Catalog', icon: '🧭' },
  ]

  const adminLinks = [
    { to: '/admin/users', label: 'User Management', icon: '👥' },
    { to: '/admin/inventory', label: 'Course Inventory', icon: '📚' },
    { to: '/admin/courses', label: 'Course Manager', icon: '🛠️' },
  ]

  const sections = [
    { title: 'Common', links: commonLinks },
    { title: 'Learner', links: role === 'user' ? learnerLinks : [] },
    { title: 'Admin', links: role === 'admin' ? adminLinks : [] },
  ]

  return (
    <aside
      className={`${
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-white/10 bg-slate-900/80 backdrop-blur-xl transition-transform md:relative`}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg">
            SS
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-300">Skill Sync</p>
            <p className="text-sm font-semibold text-white">Dashboard</p>
          </div>
        </div>
        <button
          className="md:hidden rounded-xl p-2 text-slate-200 hover:bg-white/10"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-28">
        {sections.map(
          ({ title, links }) =>
            links.length > 0 && (
              <Fragment key={title}>
                <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {title}
                </p>
                <div className="space-y-1">
                  {links.map((link) => (
                    <LinkItem key={link.to} {...link} onClick={onClose} />
                  ))}
                </div>
              </Fragment>
            ),
        )}
      </div>
      <div className="border-t border-white/10 px-4 py-4 bg-slate-900/80">
        <button onClick={logout} className="secondary-btn w-full" type="button">
          Log out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
