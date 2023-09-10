'use client'

import { ServerWithMembersWithProfile } from '@/types'
import { MemberRole } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react'
import { useModal } from '@/hooks/useModalStore'

interface ServerHeaderProps {
  server: ServerWithMembersWithProfile
  role?: MemberRole
}

export default function ServerHeader({ server, role }: ServerHeaderProps) {
  const { open } = useModal()

  const isAdmin = role === MemberRole.ADMIN
  const isModerator = role === MemberRole.MODERATOR || isAdmin
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button className='w-[90%] md:w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-700 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
          {server.name}
          <ChevronDown className='h-5 ml-auto w-5' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
        {isModerator && (
          <DropdownMenuItem
            onClick={() => open('invite', { server })}
            className='text-indigo-500 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'
          >
            Invite People
            <UserPlus className='h-4 ml-auto w-4' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <>
            <DropdownMenuItem
              onClick={() => open('editServer', { server })}
              className='px-3 py-2 text-sm cursor-pointer'
            >
              Server Settings
              <Settings className='h-4 ml-auto w-4' />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => open('members', { server })}
              className='px-3 py-2 text-sm cursor-pointer'
            >
              Manage Members
              <Users className='h-4 ml-auto w-4' />
            </DropdownMenuItem>
          </>
        )}
        {isModerator && (
          <>
            <DropdownMenuItem
              onClick={() => open('createChannel')}
              className='px-3 py-2 text-sm cursor-pointer'
            >
              Create Channel
              <PlusCircle className='h-4 ml-auto w-4' />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {isAdmin ? (
          <DropdownMenuItem
            onClick={() => open('deleteServer', { server })}
            className='text-rose-500 px-3 py-2 text-sm cursor-pointer'
          >
            Delete Server
            <Trash className='h-4 ml-auto w-4' />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => open('leaveServer', { server })}
            className='text-rose-500 px-3 py-2 text-sm cursor-pointer'
          >
            Leave Server
            <LogOut className='h-4 ml-auto w-4' />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
