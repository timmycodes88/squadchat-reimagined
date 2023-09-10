'use client'

import { UploadDropzone } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import '@uploadthing/react/styles.css'
import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import { UploadFileResponse } from 'uploadthing/client'

interface FileUploadProps {
  endpoint: 'serverImage' | 'messageFile'
  value: string
  onChange: (url?: string) => void
}

export default function FileUpload({
  endpoint,
  value,
  onChange,
}: FileUploadProps) {
  const fileType = value?.split('.').pop()
  if (value && fileType !== 'pdf') {
    return (
      <div
        className={cn(
          'relative',
          endpoint !== 'serverImage' ? 'w-64 h-64' : 'w-20 h-20'
        )}
      >
        <Image
          src={value}
          alt='Upload'
          fill
          className={cn(
            endpoint !== 'serverImage' ? 'rounded-md' : 'rounded-full'
          )}
        />
        <button
          onClick={() => onChange('')}
          type='button'
          className='bg-rose-500 text-white p-1 rounded-full absolute -top-1 -right-1 shadow-sm hover:bg-rose-700'
        >
          <X className='w-4 h-4' />
        </button>
      </div>
    )
  }

  if (value && fileType === 'pdf') {
    return (
      <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
        <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
        <a
          href={value}
          target='_blank'
          rel='noopener noreferrer'
          className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
        >
          {value}
        </a>
        <button
          onClick={() => onChange('')}
          className='bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm'
          type='button'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    )
  }

  const onClientUploadComplete = (res: UploadFileResponse[] | undefined) => {
    onChange(res?.[0].url)
  }

  const onUploadError = (err: Error) => {
    console.log(err)
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={onClientUploadComplete}
      onUploadError={onUploadError}
    />
  )
}
