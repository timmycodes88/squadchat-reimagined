import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function page({
  params: { inviteCode },
}: {
  params: { inviteCode: string }
}) {
  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  if (!inviteCode) return redirect('/')

  const existingServer = await db.server.findFirst({
    where: { inviteCode, members: { some: { id: profile.id } } },
  })

  if (existingServer) return redirect(`/servers/${existingServer.id}`)

  const server = await db.server.update({
    where: { inviteCode },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  })

  if (server) return redirect(`/servers/${server.id}`)
  else return redirect('/')
}
