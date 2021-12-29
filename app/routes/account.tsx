import { LoaderFunction, useLoaderData } from 'remix'
import {
  getAuthUser,
  logout,
  requireUserSession,
} from '~/utils/server/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request)
  const user = await getAuthUser(request)
  if (!user) {
    await logout(request)
  }

  return user
}

const ProfilePage = () => {
  const user = useLoaderData()
  return (
    <div className="min-h-[90vh] text-center">
      <h1>{user.email}</h1>
      <p>{user.first_name}</p>
    </div>
  )
}

export default ProfilePage
