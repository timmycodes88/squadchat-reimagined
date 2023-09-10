'use client'

import { cn } from '@/lib/utils'
import { useSocket } from './providers/SocketProvider'
import { Badge } from './ui/badge'
import { Loader2 } from 'lucide-react'

export default function SocketIndicator() {
  const { isConnected } = useSocket()

  if (isConnected === 'loading')
    return <Loader2 className='w-4 h-4 animate-spin' />

  return (
    <Badge
      className={cn(
        'text-white border-none',
        isConnected ? 'bg-emerald-600' : 'bg-yellow-600'
      )}
    >
      {isConnected ? 'Live' : 'Updating every 2s'}
    </Badge>
  )
}
