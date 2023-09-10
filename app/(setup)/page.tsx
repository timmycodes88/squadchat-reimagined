import InitialModal from '@/components/modals/InitialModal'
import { db } from '@/lib/db'
import { intialProfile } from '@/lib/initial-profile'
import { redirect } from 'next/navigation'

export default async function page() {
  const profile = await intialProfile()

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (server) return redirect(`/servers/${server.id}`)

  return <InitialModal />
}
