import { useEffect, useState } from 'react'

export default function useHydrate() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}
