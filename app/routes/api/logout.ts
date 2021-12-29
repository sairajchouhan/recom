import { ActionFunction } from 'remix'
import { logout } from '~/utils/server/session.server'

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    return await logout(request)
  }
  return null
}
