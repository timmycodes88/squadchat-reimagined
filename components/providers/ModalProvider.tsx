'use client'

import useHydrate from '@/hooks/useHydrate'
import InviteModal from '../modals/InviteModal'
import CreateServerModal from '../modals/CreateServerModal'
import EditServerModal from '../modals/EditServerModal'
import ManageMembersModal from '../modals/ManageMembersModal'
import CreateChannelModal from '../modals/CreateChannelModal'
import LeaverServerModal from '../modals/LeaveServerModal'
import DeleteServerModal from '../modals/DeleteServerModal'
import DeleteChannelModal from '../modals/DeleteChannelModal'
import EditChannelModal from '../modals/EditChannelModal'
import MessageFileModal from '../modals/MessageFileModal'
import DeleteMessageModal from '../modals/DeleteMessageModal'

export default function ModalProvider() {
  if (useHydrate())
    return (
      <>
        <CreateServerModal />
        <EditServerModal />
        <ManageMembersModal />
        <CreateChannelModal />
        <LeaverServerModal />
        <DeleteServerModal />
        <DeleteChannelModal />
        <EditChannelModal />
        <MessageFileModal />
        <DeleteMessageModal />
        <InviteModal />
      </>
    )
}
