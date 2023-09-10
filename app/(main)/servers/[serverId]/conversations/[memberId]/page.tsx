import ChatHeader from '@/components/chat/ChatHeader'
import ChatInput from '@/components/chat/ChatInput'
import ChatMessages from '@/components/chat/ChatMessages'
import MediaRoom from '@/components/streaming/MediaRoom'
import { getConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface ConversationPageProps {
  params: { serverId: string; memberId: string }
  searchParams: { video?: boolean }
}

export default async function page({
  params: { serverId, memberId },
  searchParams: { video },
}: ConversationPageProps) {
  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const currMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  })

  if (!currMember) return redirect('/')

  const conversation = await getConversation(currMember.id, memberId)

  if (!conversation) return redirect(`/servers/${serverId}`)

  const { memberOne, memberTwo } = conversation

  const otherMember = memberOne.id === currMember.id ? memberTwo : memberOne

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        name={otherMember.profile.name}
        serverId={serverId}
        type='conversation'
        imageUrl={otherMember.profile.imageUrl}
      />
      {video ? (
        <MediaRoom chatId={conversation.id} video audio />
      ) : (
        <>
          <ChatMessages
            member={currMember}
            name={otherMember.profile.name}
            type={'conversation'}
            apiUrl='/api/direct-messages'
            chatId={conversation.id}
            paramKey='conversationId'
            paramValue={conversation.id}
            socketUrl='/api/socket/direct-messages'
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type='conversation'
            apiUrl='/api/socket/direct-messages'
            query={{ conversationId: conversation.id }}
          />
        </>
      )}
    </div>
  )
}
