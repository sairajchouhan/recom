import bcrypt from 'bcrypt'
import { createCookieSessionStorage, redirect } from 'remix'
import { db } from './db.server'

type Temp = {
  email: string
  password: string
}

export async function signup({ email, password }: Temp) {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await db.user.create({
    data: {
      email,
      password: passwordHash,
      first_name: email.split('@')[0],
    },
  })
  return user
}

export const login = async ({ email, password }: Temp) => {
  const user = await db.user.findUnique({
    where: { email },
  })
  if (!user) return null

  const isCorrectPassword = await bcrypt.compare(password, user.password)
  if (!isCorrectPassword) return null

  return user
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'recom_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'))
}

export async function requireUserSession(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') {
    return redirect(`/login`)
  }
  return userId
}
