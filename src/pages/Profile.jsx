import useAuth from '../hooks/useAuth.js'

const Profile = () => {
  const { user, role } = useAuth()
  const displayName = user?.email ? user.email.split('@')[0] : 'Learner'

  const quickStats = [
    { label: 'Member since', value: '2026', note: 'Welcome aboard' },
    { label: 'Email', value: user?.email || '—', note: 'Primary contact' },
    { label: 'Preferred pace', value: '15–20 mins daily', note: 'Consistency first' },
  ]

  const highlights = [
    'Keep a weekly streak to unlock reminders tailored to your time zone.',
    'Save favorite courses to revisit later and share with teammates.',
    'Track progress across devices—your enrollments stay in sync.',
  ]

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="badge mb-2">Profile</p>
            <h1 className="text-3xl font-semibold text-white">{displayName}</h1>
            <p className="text-sm text-slate-300">{user?.email}</p>
          </div>
          <div className="flex gap-2 text-xs text-slate-200">
            <span className="badge">{role || 'user'}</span>
            <span className="rounded-xl bg-white/5 px-3 py-2">Personalized workspace</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quickStats.map((item) => (
          <div key={item.label} className="glass-card rounded-2xl p-5">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
            <p className="text-xs text-slate-500">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white">What’s next for you</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-200">
            {highlights.map((line) => (
              <div key={line} className="rounded-xl border border-white/5 bg-white/5 px-4 py-3">
                {line}
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Support</h3>
          <p className="text-sm text-slate-300">Need changes to your account? Reach out and we’ll tailor your space.</p>
          <div className="space-y-2 text-sm text-slate-200">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="font-semibold text-white">Contact</p>
              <p className="text-xs text-slate-400">support@skillsync.local</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="font-semibold text-white">Feedback</p>
              <p className="text-xs text-slate-400">Share a feature idea to shape your dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
