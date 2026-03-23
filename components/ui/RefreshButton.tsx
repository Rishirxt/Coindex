'use client'

import { refreshData } from '@/lib/actions'
import { RefreshCw } from 'lucide-react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function RefreshButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  
  return (
    <button 
      onClick={() => {
        startTransition(async () => {
          await refreshData()
          router.refresh()
        })
      }}
      disabled={isPending}
      className={`px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-2 ${isPending ? 'opacity-50' : ''}`}
      title="Refresh Data"
    >
      <RefreshCw size={16} className={`text-[#00D4AA] ${isPending ? 'animate-spin' : ''}`} />
      <span className="text-sm font-medium text-white/90">Refresh</span>
    </button>
  )
}
