'use client'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { useParams, useRouter } from 'next/navigation'

interface ServerSearchProps {
  data: {
    label: string
    type: 'channel' | 'member'
    data?: {
      id: string
      name: string
      icon: React.ReactNode
    }[]
  }[]
}

export default function ServerSearch({ data }: ServerSearchProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.ctrlKey) {
        e.preventDefault()
        setOpen(curr => !curr)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const onCommandSelect = ({
    id,
    type,
  }: {
    id: string
    type: 'channel' | 'member'
  }) => {
    setOpen(false)
    if (type === 'channel') {
      router.push(`/servers/${params?.serverId}/channels/${id}`)
    } else {
      router.push(`/servers/${params?.serverId}/conversations/${id}`)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
      >
        <Search className='w-4 h-4 text-zinc-500 dar:text-zinc-400' />
        <p className='font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition'>
          Search
        </p>
        <kbd className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg--muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground ml-auto'>
          <span className='text-xs'>CTRL</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search all channels and members' />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(({ label, data, type }) => {
            if (!data?.length) return null
            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ id, name, icon }) => (
                  <CommandItem
                    onSelect={() => onCommandSelect({ id, type })}
                    key={id}
                  >
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}
