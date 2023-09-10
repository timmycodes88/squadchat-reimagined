'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

import { useModal } from '@/hooks/useModalStore'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Check, Copy } from 'lucide-react'
import useOrigin from '@/hooks/useOrigin'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { updateServerInviteCode } from '@/lib/actions.ts/server.actions'

export default function InviteModal() {
  const { isOpen, open, close, type, data } = useModal()
  const server = data.server

  const isModalOpen = isOpen && type === 'invite'

  const origin = useOrigin()

  const handleClose = () => close()

  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const onNew = async () => {
    if (!server) return toast.error('Server not found')
    setIsLoading(true)
    const { error, server: newServer } = await updateServerInviteCode(
      server?.id
    )
    setIsLoading(false)
    if (error) return toast.error(error)
    open('invite', { server: newServer })
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className='p-6'>
          <Label className='uppercase text-sx font-bold text-zinc-500 dark:text-secondary/70'>
            Server Invite Link
          </Label>
          <div className='flex items-center mt-2 gap-x-2'>
            <Input
              disabled={isLoading}
              className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
              value={inviteUrl}
            />
            <Button size='icon' disabled={isLoading} onClick={onCopy}>
              {copied ? (
                <Check className='w-4 h-4' />
              ) : (
                <Copy className='w-4 h-4' />
              )}
            </Button>
          </div>
          <Button
            onClick={onNew}
            disabled={isLoading}
            variant={'link'}
            size='sm'
            className='text-xs text-zinc-500 mt-4'
          >
            Generate a new link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
