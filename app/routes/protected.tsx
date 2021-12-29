import type { LoaderFunction } from 'remix'
import { requireUserSession } from '~/utils/server/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request)
  return null
}

const Protected = () => {
  return <div>I am protected</div>
}

export default Protected
