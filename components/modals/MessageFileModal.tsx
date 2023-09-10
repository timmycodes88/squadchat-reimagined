'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import qs from 'query-string'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Button } from '../ui/button'
import FileUpload from '../FileUpload'
import { useRouter } from 'next/navigation'
import { createServer } from '@/lib/actions.ts/server.actions'
import { toast } from 'react-hot-toast'
import { useModal } from '@/hooks/useModalStore'
import axios from 'axios'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  fileUrl: z.string().min(2, 'Please upload an image.'),
})

export default function MessageFileModal() {
  const { isOpen, close, type, data } = useModal()
  const { apiUrl, query } = data
  const router = useRouter()

  const isModalOpen = isOpen && type === 'messageFile'

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const url = qs.stringifyUrl({
      url: apiUrl || '',
      query,
    })
    try {
      await axios.post(url, { ...values, content: values.fileUrl })
      form.reset()
      router.refresh()
      close()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleClose = () => {
    form.reset()
    close()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Add an attachment
          </DialogTitle>
          <DialogDescription>Send a file as a message.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='fileUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint='messageFile'
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button disabled={isLoading} variant={'primary'}>
                {isLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  'Send'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
