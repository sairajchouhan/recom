import { LoaderFunction, useLoaderData } from 'remix'
import CartSummary from '~/components/CartSummary'
import { getCartSummary } from '~/utils/server/cart.server'
import { getUserIdFromSession, logout } from '~/utils/server/session.server'

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

const AddressIndex = () => {
  const data = useLoaderData()
  return (
    <div>
      <CartSummary data={data} />
      <button className="w-full mt-6 btn btn-primary">Place Order</button>
    </div>
  )
}

export default AddressIndex
