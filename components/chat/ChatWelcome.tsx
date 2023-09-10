import { Hash } from 'lucide-react'

interface ChatWelcomeProps {
  type: 'channel' | 'conversation'
  name: string
}

export default function ChatWelcome({ type, name }: ChatWelcomeProps) {
  return (
    <div className='space-y-2 px-4 mb-4'>
      {type === 'channel' ? (
        <div className='h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center'>
          <Hash className='h-12 w-12 text-white' />
        </div>
      ) : null}
      <p className='text-xl md:text-3xl font-bold'>
        {type === 'channel' && 'Welcome to #'}
        {name}
      </p>
      <p className='text-zinc-600 text-sm dark:text-zinc-400'>
        {type === 'channel'
          ? `This is the beginning of the #${name} channel.`
          : `This is the beginning of your conversation with ${name}.`}
      </p>
    </div>
  )
}
