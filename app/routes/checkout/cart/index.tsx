import { Link, LoaderFunction, useLoaderData } from 'remix'
import { getUserIdFromSession, logout } from '~/utils/server/session.server'
import CartSummary from '~/components/CartSummary'
import { getCartSummary } from '~/utils/server/cart.server'

export const loader: LoaderFunction = async ({ request }) => {
  const taxPercentage = 0.18
  const userId = await getUserIdFromSession(request)
  if (!userId || typeof userId !== 'string') {
    return await logout(request)
  }

  const cartSummary = await getCartSummary({
    userId,
    taxPercentage,
  })

  return cartSummary
}

const CartIndex = () => {
  const data = useLoaderData()

  if (!data) return null

  return (
    <div>
      <CartSummary data={data} />
      <Link to="/checkout/address">
        <button className="w-full mt-6 btn btn-primary">Select Address</button>
      </Link>
    </div>
  )
}

export const CatchBoundary = () => {
  return (
    <div className="min-h-sm bg-blue-50/70">
      <h1>Something went wrong</h1>
    </div>
  )
}

export default CartIndex
