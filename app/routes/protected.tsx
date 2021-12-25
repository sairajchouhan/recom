import type { LoaderFunction } from 'remix'
import { requireUserSession } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user_id = requireUserSession(request)
  return user_id
}

const Protected = () => {
  return <div>I am protected</div>
}

export default Protected
