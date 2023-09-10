'use client'

import { cn } from '@/lib/utils'
import ActionTooltip from '../action-tooltip'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

interface NavigationItemProps {
  id: string
  imageUrl: string
  name: string
}

export default function NavigationItem({
  id,
  name,
  imageUrl,
}: NavigationItemProps) {
  const params = useParams()
  const router = useRouter()

  const onClick = () => {
    router.push(`/servers/${id}`)
  }

  return (
    <ActionTooltip label={name} side='right' align='center'>
      <button onClick={onClick} className='group flex items-center'>
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
            params?.serverId === id
              ? 'h-[36px]'
              : 'h-[8px] group-hover:h-[20px]'
          )}
        />
        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            params?.serverId === id &&
              'bg-primary/10 text-primary rounded-[16px]'
          )}
        >
          <Image src={imageUrl} alt={'Channel'} fill />
        </div>
      </button>
    </ActionTooltip>
  )
}
