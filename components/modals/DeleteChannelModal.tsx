'use client'

import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

import { useModal } from '@/hooks/useModalStore'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { deleteChannel } from '@/lib/actions.ts/server.actions'
import { Loader2 } from 'lucide-react'

export default function DeleteChannelModal() {
  const router = useRouter()
  const { isOpen, close, type, data } = useModal()
  const { server, channel } = data
  const isModalOpen = isOpen && type === 'deleteChannel'

  const [isLoading, setIsLoading] = useState(false)

  const onConfirm = async () => {
    if (!server || !channel) return toast.error('Server not found')
    setIsLoading(true)
    const { error } = await deleteChannel(server.id, channel.id)
    setIsLoading(false)
    if (error) return toast.error(error)
    close()
    router.refresh()
    router.push(`/servers/${server?.id}`)
  }

  const handleClose = () => close()

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Delete Channel
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to do this? <br />
            <span className='font-semibold text-indigo-500'>
              #{channel?.name}
            </span>{' '}
            will be deleted forever.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <div className='flex w-full items-center justify-between'>
            <Button
              disabled={isLoading}
              onClick={handleClose}
              variant={'ghost'}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onConfirm}
              variant={'destructive'}
            >
              {isLoading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                'Confirm'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
