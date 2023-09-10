'use client'

import qs from 'query-string'
import { ServerWithMembersWithProfile } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

import { useModal } from '@/hooks/useModalStore'
import { ScrollArea } from '../ui/scroll-area'
import UserAvatar from '../UserAvatar'
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { MemberRole } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { updateMemberRole } from '@/lib/actions.ts/server.actions'

const RoleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
  ADMIN: <ShieldAlert className='h-4 w-4 ml-2 text-rose-500' />,
}

export default function ManageMembersModal() {
  const router = useRouter()
  const { isOpen, open, close, type, data } = useModal()
  const server = data.server as ServerWithMembersWithProfile

  const [loadingId, setLoadingId] = useState('')

  const isModalOpen = isOpen && type === 'members'

  const handleClose = () => close()

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    setLoadingId(memberId)
    const { server: newServer, error } = await updateMemberRole(
      server.id,
      memberId,
      role
    )
    setLoadingId('')
    if (error) return toast.error(error)
    router.refresh()
    open('members', { server: newServer })
  }

  const onKick = async (memberId: string) => {
    setLoadingId(memberId)
    const { server: newServer, error } = await updateMemberRole(
      server.id,
      memberId,
      'KICK'
    )
    setLoadingId('')
    if (error) return toast.error(error)
    router.refresh()
    open('members', { server: newServer })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Manage Members
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='mt-8 max-h-[420px] pr-6'>
          {server?.members?.map(member => (
            <div key={member.id} className='flex items-center gap-x-2 mb-6'>
              <UserAvatar src={member.profile.imageUrl} />
              <div className='flex flex-col gap-y-1'>
                <div className='text-sm font-semibold flex items-center'>
                  {member.profile.name}
                  {RoleIconMap[member.role]}
                </div>
                <p className='text-xs text-zinc-500'>{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className='ml-auto'>
                    <DropdownMenu>
                      <DropdownMenuTrigger className='outline-none'>
                        <MoreVertical className='h-4 w-4 text-zinc-400' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side='left'>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className='flex items-center'>
                            <ShieldQuestion className='w-4 h-4 mr-2' />
                            <span>role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, 'GUEST')}
                              >
                                <Shield className='w-4 h-4 mr-2' />
                                Guest
                                {member.role === 'GUEST' && (
                                  <Check className='w-4 h-4 ml-auto' />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, 'MODERATOR')
                                }
                              >
                                <ShieldCheck className='w-4 h-4 mr-2' />
                                Mod
                                {member.role === 'MODERATOR' && (
                                  <Check className='w-4 h-4 ml-auto' />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <Gavel className='h-4 w-4 mr-2' /> Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className='animate-spin text-zinc-500 ml-auto w-4 h-4' />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
