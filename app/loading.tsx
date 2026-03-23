export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 mt-14 min-h-screen">
      <div className="animate-pulse">
        <div className="h-10 w-48 bg-white/5 rounded-lg mb-4" />
        <div className="h-6 w-96 bg-white/5 rounded-lg mb-12" />
        <div className="w-full h-[500px] glass-card rounded-3xl bg-white/5" />
      </div>
    </div>
  )
}
