import { set } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'

interface useChatScrollProps {
  chatRef: React.RefObject<HTMLDivElement>
  bottomRef: React.RefObject<HTMLDivElement>
  shouldLoadMore: boolean
  loadMore: () => void
  count: number
}

export default function useChatScroll({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: useChatScrollProps) {
  const [canScrollToBottom, setCanScrollToBottom] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    const topDiv = chatRef?.current

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore()
      }

      if (topDiv && bottomRef.current) {
        const distanceToBottom =
          topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight

        setCanScrollToBottom(distanceToBottom > 100)
      }
    }

    if (!topDiv) return

    topDiv.addEventListener('scroll', handleScroll)

    return () => {
      topDiv.removeEventListener('scroll', handleScroll)
    }
  }, [bottomRef, chatRef, loadMore, shouldLoadMore])

  useEffect(() => {
    const topDiv = chatRef?.current
    const bottomDiv = bottomRef?.current

    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true)
        return true
      }
      if (!topDiv) return false

      const distanceToBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
      return distanceToBottom <= 100
    }

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [bottomRef, chatRef, hasInitialized, count])

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [bottomRef])

  return { canScrollToBottom, scrollToBottom }
}
