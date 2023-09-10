import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

interface ServerPageProps {
  params: { serverId: string }
}

export default async function page({ params: { serverId } }: ServerPageProps) {
  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  const initialChannel = server?.channels[0]

  if (!initialChannel || initialChannel.name !== 'general')
    return <div className='p-4'>Something went wrong... :(</div>
  else return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`)
}
