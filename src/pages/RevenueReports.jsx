import { useMemo, useState } from 'react'
import { downloadRevenueCsv } from '../api'

const RevenueReports = () => {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)

  const summary = useMemo(
    () => [
      { label: 'MRR', value: '$142k' },
      { label: 'ARPU', value: '$42' },
      { label: 'Churn', value: '3.2%' },
    ],
    [],
  )

  const handleDownload = async () => {
    setError(null)
    setDownloading(true)
    try {
      const res = await downloadRevenueCsv()
      const blob = new Blob([res.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'revenue-report.csv'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      const serverMsg = err?.response?.data?.message
      setError(serverMsg || 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="badge">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Revenue Reports</h1>
          <p className="text-sm text-slate-300">Monitor monetization and payout health.</p>
        </div>
        <button className="primary-btn" onClick={handleDownload} disabled={downloading}>
          {downloading ? 'Preparing…' : 'Download CSV'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {summary.map((item) => (
          <div key={item.label} className="glass-card rounded-2xl p-5">
            <p className="text-sm text-slate-300">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white">This week</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {['Cohort renewals trending +6%', 'Enterprise upsell pipeline ready', 'Revenue leak checks passed'].map(
            (item) => (
              <div
                key={item}
                className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )
}

export default RevenueReports
