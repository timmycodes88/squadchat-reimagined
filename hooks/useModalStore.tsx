import { Channel, ChannelType, Server } from '@prisma/client'
import { create } from 'zustand'

export type ModalType =
  | 'createServer'
  | 'invite'
  | 'editServer'
  | 'members'
  | 'createChannel'
  | 'leaveServer'
  | 'deleteServer'
  | 'deleteChannel'
  | 'editChannel'
  | 'messageFile'
  | 'deleteMessage'

interface ModalData {
  server?: Server
  channel?: Channel
  channelType?: ChannelType
  apiUrl?: string
  query?: Record<string, any>
}

interface ModalStore {
  type: ModalType | null
  data: ModalData
  isOpen: boolean
  open: (type: ModalType, data?: ModalData) => void
  close: () => void
}

export const useModal = create<ModalStore>(set => ({
  type: null,
  data: {},
  isOpen: false,
  open: (type, data = {}) => set({ type, isOpen: true, data }),
  close: () => set({ isOpen: false }),
}))
