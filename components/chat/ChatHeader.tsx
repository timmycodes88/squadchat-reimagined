import { Hash, Mic, Video } from 'lucide-react'
import MobileToggle from '../MobileToggle'
import UserAvatar from '../UserAvatar'
import { ChannelType } from '@prisma/client'
import SocketIndicator from '../SocketIndicator'
import ChatVideoButton from './ChatVideoButton'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  imageUrl?: string
  channelType?: ChannelType
}

const channelIconMap = {
  [ChannelType.TEXT]: (
    <Hash className='w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2 ' />
  ),
  [ChannelType.AUDIO]: (
    <Mic className='w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2 ' />
  ),
  [ChannelType.VIDEO]: (
    <Video className='w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2 ' />
  ),
}

export default function ChatHeader({
  serverId,
  name,
  type,
  imageUrl,
  channelType,
}: ChatHeaderProps) {
  return (
    <div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 shadow-md'>
      <MobileToggle serverId={serverId} />
      {type === 'channel' ? (
        <>{channelType && channelIconMap[channelType]}</>
      ) : (
        type === 'conversation' && (
          <UserAvatar src={imageUrl} className='md:h-8 md:w-8 mr-2' />
        )
      )}
      <p className='font-semibold text-md text-black dark:text-white'>{name}</p>
      <div className='ml-auto flex items-center'>
        {type === 'conversation' && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  )
}
