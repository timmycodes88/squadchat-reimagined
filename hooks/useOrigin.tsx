import { use } from 'react'
import useHydrate from './useHydrate'

export default function useOrigin() {
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : ''

  if (useHydrate()) return origin
  else return ''
}
