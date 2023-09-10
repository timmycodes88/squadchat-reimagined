'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = useMemo(() => new QueryClient(), [])

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
