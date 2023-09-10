'use client'

import * as z from 'zod'
import axios from 'axios'
import qs from 'query-string'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useModal } from '@/hooks/useModalStore'
import { toast } from 'react-hot-toast'
import EmojiPicker from '../EmojiPicker'
// import { EmojiPicker } from "@/components/emoji-picker";

interface ChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: 'conversation' | 'channel'
}

const formSchema = z.object({
  content: z.string().min(1),
})

export default function ChatInput({
  apiUrl,
  query,
  name,
  type,
}: ChatInputProps) {
  const { open } = useModal()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.content) return
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })
      const content = values.content
      form.reset()
      await axios.post(url, { content })

      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <Form {...form}>
      <form autoComplete='off' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative p-4 pb-6'>
                  <button
                    type='button'
                    onClick={() => open('messageFile', { apiUrl, query })}
                    className='absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center'
                  >
                    <Plus className='text-white dark:text-[#313338]' />
                  </button>
                  <Input
                    autoCapitalize='off'
                    autoCorrect='off'
                    autoSave='off'
                    disabled={isLoading}
                    className='px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                    placeholder={`Message ${
                      type === 'conversation' ? name : '#' + name
                    }`}
                    {...field}
                  />
                  <div className='hidden md:block absolute top-7 right-8'>
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                  <div className='md:hidden absolute top-7 right-8'>
                    <button>
                      <Send className='text-zinc-500 dark:text-zinc-400' />
                    </button>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
