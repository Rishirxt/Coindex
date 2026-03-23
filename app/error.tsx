'use client'

import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="w-full flex-col min-h-[60vh] flex items-center justify-center px-4">
      <div className="glass-card p-12 rounded-3xl flex flex-col items-center max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-[#F43F5E]/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-[#F43F5E]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
        <p className="text-white/50 mb-8">
          We couldn't fetch the data. Please try again or check your connection.
        </p>
        <button
          onClick={() => reset()}
          className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-8 rounded-full transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
