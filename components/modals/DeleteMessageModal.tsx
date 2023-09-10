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
import { Loader2 } from 'lucide-react'
import qs from 'query-string'
import axios from 'axios'

export default function DeleteMessageModal() {
  const { isOpen, close, type, data } = useModal()
  const { apiUrl, query } = data
  const isModalOpen = isOpen && type === 'deleteMessage'

  const [isLoading, setIsLoading] = useState(false)

  const onConfirm = async () => {
    if (!apiUrl || !query) return toast.error('Message not found')
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })
      await axios.delete(url)
      close()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => close()

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Delete Message
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure you want to do this?
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
