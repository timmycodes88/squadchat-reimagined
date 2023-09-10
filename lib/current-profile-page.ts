import { getAuth } from '@clerk/nextjs/server'

import { auth } from '@clerk/nextjs'
import { db } from './db'
import { NextApiRequest } from 'next'

export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req)

  if (!userId) return null

  const profile = await db.profile.findUnique({
    where: { userId },
  })

  return profile
}
