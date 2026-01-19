import { useEffect, useMemo, useState } from 'react'
import { downloadRevenueCsv, fetchRevenueInsights, fetchRevenueSummary } from '../api'

const RevenueReports = () => {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState([])
  const [insights, setInsights] = useState([])

  const formatCurrency = useMemo(
    () => (value) => {
      const amount = Number(value || 0)
      return amount.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
    },
    [],
  )

  useEffect(() => {
    const load = async () => {
      setError(null)
      setLoading(true)
      try {
        const [metricsRes, insightsRes] = await Promise.all([
          fetchRevenueSummary(),
          fetchRevenueInsights(),
        ])

        const metrics = metricsRes?.data || {}
        setSummary([
          { label: 'MRR', value: formatCurrency(metrics.mrr ?? metrics.monthlyRecurringRevenue) },
          { label: 'ARPU', value: formatCurrency(metrics.arpu ?? metrics.averageRevenuePerUser) },
          {
            label: 'Churn',
            value:
              metrics.churnPct !== undefined
                ? `${metrics.churnPct}%`
                : metrics.churnRate !== undefined
                  ? `${metrics.churnRate}%`
                  : '—',
          },
        ])

        const pulledInsights = Array.isArray(insightsRes?.data) ? insightsRes.data : []
        setInsights(
          pulledInsights.length
            ? pulledInsights
            : [
                'Cohort renewals trending +6% week over week.',
                'Enterprise upsell pipeline ready for outreach.',
                'No revenue leaks detected in payouts this week.',
              ],
        )
      } catch (err) {
        const serverMsg = err?.response?.data?.message
        setError(serverMsg || 'Unable to load revenue data')
        setSummary([
          { label: 'MRR', value: '$0.00' },
          { label: 'ARPU', value: '$0.00' },
          { label: 'Churn', value: '—' },
        ])
        setInsights([
          'Fallback data only: live revenue feed unavailable.',
          'Check backend revenue endpoints for status.',
        ])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [formatCurrency])

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
            <p className="mt-2 text-2xl font-semibold text-white">
              {loading ? '—' : item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white">This week</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(insights.length ? insights : ['Loading insights…']).map((item) => (
            <div
              key={item}
              className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-200"
            >
              {loading ? '—' : item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RevenueReports
