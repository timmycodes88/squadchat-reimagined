'use client'

import { useUser } from '@clerk/nextjs'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import '@livekit/components-styles'
import { Loader2, Video } from 'lucide-react'
import { useEffect, useState } from 'react'

interface MediaRoomProps {
  chatId: string
  video: boolean
  audio: boolean
}

export default function MediaRoom({ chatId, video, audio }: MediaRoomProps) {
  const { user } = useUser()
  const [token, setToken] = useState('')

  useEffect(() => {
    let name = 'Anonymous'
    if (user?.firstName && user?.lastName)
      name = `${user.firstName} ${user.lastName}`
    ;(async () => {
      try {
        const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
        const data = await res.json()

        setToken(data.token)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [chatId, user?.firstName, user?.lastName])

  if (!token)
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='w-10 h-10 text-zinc-500 animate-spin my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading...</p>
      </div>
    )

  return (
    <LiveKitRoom
      data-lk-theme='default'
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}
