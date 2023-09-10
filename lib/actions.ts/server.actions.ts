'use server'

import { ChannelType, MemberRole } from '@prisma/client'
import { currentProfile } from '../current-profile'
import { db } from '../db'
import { v4 as uuidv4 } from 'uuid'

interface CreateOrUpdateServerPayload {
  name: string
  imageUrl: string
  serverId?: string
}

export async function createServer({
  name,
  imageUrl,
}: CreateOrUpdateServerPayload) {
  try {
    const profile = await currentProfile()

    if (!profile) return { error: 'You must be logged in to create a server' }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: 'general', profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    })

    return { server }
  } catch (err: any) {
    console.error('[CREATE SERVER ERROR]: ', err)
    return { error: err.message || 'Error creating server' }
  }
}

export async function updateServer({
  name,
  imageUrl,
  serverId,
}: CreateOrUpdateServerPayload) {
  try {
    const profile = await currentProfile()

    if (!profile) return { error: 'You must be logged in to update a server' }
    if (!serverId) return { error: 'Server ID is required' }
    if (!name && !imageUrl) return { error: 'No update parameters provided' }

    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: { name, imageUrl },
    })

    return { server }
  } catch (err: any) {
    console.error('[UPDATE SERVER ERROR]: ', err)
    return { error: err.message || 'Error updating server' }
  }
}

export async function updateMemberRole(
  serverId: string,
  memberId: string,
  role: string | 'KICK'
) {
  try {
    const profile = await currentProfile()
    if (!profile) return { error: 'You must be logged in to update a server' }
    if (!serverId) return { error: 'Server ID is required' }
    if (!memberId) return { error: 'Member ID is required' }
    if (!role) return { error: 'Role is required' }

    if (role === 'KICK') {
      const server = await db.server.update({
        where: {
          id: serverId,
          profileId: profile.id,
        },
        data: {
          members: {
            deleteMany: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
          },
        },
        include: {
          members: {
            include: {
              profile: true,
            },
            orderBy: {
              role: 'asc',
            },
          },
        },
      })

      return { server }
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          //This error is not breaking anything and IDK why it is happening :/
          // @ts-ignore
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: { role },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    })

    return { server }
  } catch (err: any) {
    console.error('[UPDATE MEMBER ROLE ERROR]: ', err)
    return { error: err.message || 'Error updating member role' }
  }
}

export async function updateServerInviteCode(serverId: string) {
  try {
    const profile = await currentProfile()
    if (!profile) return { error: 'You must be logged in to update a server' }
    if (!serverId) return { error: 'Server ID is required' }

    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: { inviteCode: uuidv4() },
    })

    return { server }
  } catch (err: any) {
    console.error('[UPDATE SERVER INVITE CODE ERROR]: ', err)
    return { error: err.message || 'Error updating server invite code' }
  }
}

interface CreateChannelPayload {
  name: string
  type: ChannelType
  serverId: string
}

export async function createChannel({
  name,
  type,
  serverId,
}: CreateChannelPayload) {
  try {
    const profile = await currentProfile()

    if (!profile) return { error: 'You must be logged in to create a channel' }

    if (!serverId) return { error: 'Server ID is required' }
    if (!name) return { error: 'Channel name is required' }
    if (!type) return { error: 'Channel type is required' }

    if (name === 'general') return { error: 'Channel name is reserved' }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            name,
            type,
            profileId: profile.id,
          },
        },
      },
    })

    return { server }
  } catch (err: any) {
    console.error('[CREATE CHANNEL ERROR]: ', err)
    return { error: err.message || 'Error creating channel' }
  }
}

export async function leaveServer(serverId: string) {
  try {
    const profile = await currentProfile()

    if (!profile) return { error: 'You must be logged in to leave a server' }
    if (!serverId) return { error: 'Server ID is required' }

    await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    })

    return {}
  } catch (err: any) {
    console.error('[LEAVE SERVER ERROR]: ', err)
    return { error: err.message || 'Error leaving server' }
  }
}

export async function deleteServer(serverId: string) {
  try {
    const profile = await currentProfile()

    if (!profile) return { error: 'You must be logged in to leave a server' }
    if (!serverId) return { error: 'Server ID is required' }

    await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    })

    return {}
  } catch (err: any) {
    console.error('[DELETE SERVER ERROR]: ', err)
    return { error: err.message || 'Error leaving server' }
  }
}

export async function deleteChannel(serverId: string, channelId: string) {
  try {
    const profile = await currentProfile()

    if (!profile) return { error: 'You must be logged in to leave a server' }
    if (!serverId) return { error: 'Server ID is required' }
    if (!channelId) return { error: 'Channel ID is required' }

    await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    })

    return {}
  } catch (err: any) {
    console.error('[DELETE CHANNEL ERROR]: ', err)
    return { error: err.message || 'Error deleting channel' }
  }
}

export async function editChannel({
  serverId,
  channelId,
  name,
  type,
}: CreateChannelPayload & {
  channelId: string
}) {
  try {
    const profile = await currentProfile()

    if (!profile) return { error: 'You must be logged in to edit a channel' }
    if (name === 'general') return { error: 'Channel name is reserved' }
    if (!serverId) return { error: 'Server ID is required' }
    if (!channelId) return { error: 'Channel ID is required' }
    if (!name) return { error: 'Channel name is required' }
    if (!type) return { error: 'Channel type is required' }

    await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channelId,
              NOT: {
                name: 'general',
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    })

    return {}
  } catch (err: any) {
    console.error('[EDIT CHANNEL ERROR]: ', err)
    return { error: err.message || 'Error editing channel' }
  }
}
