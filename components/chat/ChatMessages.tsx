'use client'

import { Member, Message, Profile } from '@prisma/client'
import ChatWelcome from './ChatWelcome'
import useChatQuery from '@/hooks/useChatQuery'
import { Loader2, ServerCrash } from 'lucide-react'
import { ElementRef, Fragment, useRef } from 'react'
import ChatItem from './ChatItem'
import { format } from 'date-fns'
import useChatSocket from '@/hooks/useChatSocket'
import { is } from 'date-fns/locale'
import useChatScroll from '@/hooks/useChatScroll'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

const DATE_FORMAT = 'd MMM yyyy, hh:mm a'

interface ChatMessagesProps {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, any>
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
  type: 'channel' | 'conversation'
}

type MessageWithMemberWithProfile = Message & {
  member: Member & { profile: Profile }
}

export default function ChatMessages({
  name,
  member,
  chatId,
  socketUrl,
  apiUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const chatRef = useRef<ElementRef<'div'>>(null)
  const bottomRef = useRef<ElementRef<'div'>>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    })
  useChatSocket({ queryKey, addKey, updateKey })
  const { canScrollToBottom, scrollToBottom } = useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  })

  if (status === 'loading')
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-10 w-10 animate-spin text-zinc-500' />
        <p className='text-xs pt-2 text-zinc-500 dark:text-zinc-400'>
          Loading messages...
        </p>
      </div>
    )
  if (status === 'error')
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <ServerCrash className='h-10 w-10 text-zinc-500' />
        <p className='text-sm pt-2 text-zinc-500 dark:text-zinc-400'>
          Something went wrong!
        </p>
      </div>
    )

  return (
    <div ref={chatRef} className='flex-1 flex flex-col py-4 overflow-y-auto'>
      <Button
        variant={'primary'}
        onClick={scrollToBottom}
        className={cn(
          'absolute z-10 bottom-[94px] right-8 w-fit px-2 h-8 rounded-full text-xs transition-all duration-300',
          !canScrollToBottom && 'translate-x-[200%]'
        )}
      >
        Back to present
      </Button>

      {!hasNextPage ? (
        <>
          <div className='flex-1' />
          <ChatWelcome type={type} name={name} />
        </>
      ) : (
        <div className='flex justify-center'>
          {isFetchingNextPage ? (
            <Loader2 className='w-6 h-6 animate-spin text-zinc-500 my-4' />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className='text-sm my-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className='flex flex-col-reverse mt-auto'>
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                content={message.content}
                member={message.member}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
