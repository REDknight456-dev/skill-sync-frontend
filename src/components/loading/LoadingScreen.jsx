const LoadingScreen = ({ message = 'Loading' }) => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 shadow-lg shadow-indigo-500/20">
      <div className="h-4 w-4 rounded-full border-2 border-transparent border-t-indigo-400 border-r-cyan-300 spin" />
      <p className="text-sm font-semibold text-slate-100">{message}...</p>
    </div>
  </div>
)

export default LoadingScreen
