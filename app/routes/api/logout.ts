import { ActionFunction, json, redirect } from 'remix'
import { logout } from '~/utils/session.server'

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    return await logout(request)
  }
  return null
}
