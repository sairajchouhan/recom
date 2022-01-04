import { LoaderFunction, useLoaderData } from 'remix'
import { db } from '~/utils/server/db.server'
import { getUserIdFromSession, logout } from '~/utils/server/session.server'
import { Prisma } from '@prisma/client'

export const loader: LoaderFunction = async ({ request }) => {
  const taxPercentage = 0.18
  const userId = await getUserIdFromSession(request)
  if (!userId || typeof userId !== 'string') {
    return await logout(request)
  }
  const userCart = await db.userCart.findFirst({
    where: {
      userId,
    },
  })

  if (!userCart) {
    throw new Response('Cart not found', {
      status: 400,
    })
  }

  const tax = new Prisma.Decimal(userCart.totalPrice)
    .mul(taxPercentage)
    .toFixed(2)
  const deliveryCharge = new Prisma.Decimal(5).toFixed(2)
  const totalPriceForProducts = new Prisma.Decimal(userCart.totalPrice).toFixed(
    2
  )
  const total = new Prisma.Decimal(totalPriceForProducts)
    .add(tax)
    .add(deliveryCharge)
    .toFixed(2)

  const returnData =
    userCart.totalItems > 0
      ? {
          totalItems: userCart.totalItems,
          deliveryCharge,
          totalPriceForProducts,
          tax,
          total,
        }
      : null

  return returnData
}

const CartIndex = () => {
  const data = useLoaderData()

  if (!data) return null

  return (
    <div className="p-6 rounded-md shadow-sm bg-blue-50/60">
      <h3 className="mb-4 text-lg font-medium text-slate-700">Order Summary</h3>

      <div className="grid grid-cols-1 divide-y">
        <div className="flex items-center justify-between py-3 text-slate-600">
          <h6>Total Items</h6>
          <p>{data?.totalItems}</p>
        </div>
        <div className="flex items-center justify-between py-3 text-slate-600">
          <h6>Total Items Price</h6>
          <p>{data?.totalPriceForProducts}</p>
        </div>
        <div className="flex items-center justify-between py-3 text-slate-600">
          <h6>Delivery Charge</h6>
          <p>${data?.deliveryCharge}</p>
        </div>
        <div className="flex items-center justify-between py-3 text-slate-600">
          <h6>Tax</h6>
          <p>${data?.tax}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-lg font-medium">
        <h3 className="mt-4 text-slate-700">Order Total</h3>
        <p>${data?.total}</p>
      </div>
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
