import ChatHeader from '@/components/chat/ChatHeader'
import ChatInput from '@/components/chat/ChatInput'
import ChatMessages from '@/components/chat/ChatMessages'
import MediaRoom from '@/components/streaming/MediaRoom'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'

interface ChannelPageProps {
  params: { serverId: string; channelId: string }
}

export default async function page({
  params: { serverId, channelId },
}: ChannelPageProps) {
  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  })

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  })

  if (!channel || !member) return redirect('/')

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full relative'>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type='channel'
        channelType={channel.type}
      />
      {channel.type === ChannelType.TEXT ? (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            type={'channel'}
            apiUrl='/api/messages'
            socketUrl='/api/socket/messages'
            socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
            paramKey='channelId'
            paramValue={channel.id}
            chatId={channel.id}
          />
          <ChatInput
            name={channel.name}
            type='channel'
            apiUrl='/api/socket/messages'
            query={{ channelId: channel.id, serverId: channel.serverId }}
          />
        </>
      ) : channel.type === ChannelType.AUDIO ? (
        <MediaRoom
          key={channel.id}
          chatId={channel.id}
          video={false}
          audio={true}
        />
      ) : (
        channel.type === ChannelType.VIDEO && (
          <MediaRoom
            key={channel.id}
            chatId={channel.id}
            video={true}
            audio={true}
          />
        )
      )}
    </div>
  )
}
