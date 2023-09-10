'use client'

import { Plus } from 'lucide-react'
import ActionTooltip from '../action-tooltip'
import { useModal } from '@/hooks/useModalStore'

export default function NavigationAction() {
  const { open } = useModal()
  return (
    <div>
      <ActionTooltip label='Add a server' side='right' align='center'>
        <button
          onClick={() => open('createServer')}
          className='group flex items-center'
        >
          <div className='flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500'>
            <Plus className='group-hover:text-white transition text-emerald-500' />
          </div>
        </button>
      </ActionTooltip>
    </div>
  )
}
