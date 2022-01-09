import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
  useTransition,
} from 'remix'
import type { CartItem, Product } from '@prisma/client'

import { ActionMethods } from '~/types'
import { createActionObject } from '~/utils/helpers'
import { getUserIdFromSession, logout } from '~/utils/server/session.server'
import CartItemComponent from '~/components/CartItem'
import {
  getCartItems,
  removeCartItem,
  updateQuantityOfCartItem,
} from '~/utils/server/cart.server'
interface LoaderData {
  cartItems: (CartItem & {
    product: Product
  })[]
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserIdFromSession(request)
  if (!userId) {
    return await logout(request)
  }

  const cartItems = await getCartItems(userId)

  return json({
    cartItems,
  })
}

export const action: ActionFunction = (args) => {
  const method = args.request.method as keyof ActionMethods
  const actionObject = createActionObject()

  actionObject.POST = async ({ request }) => {
    const rawFormData = await request.formData()
    const formData: any = {}
    for (let [key, value] of rawFormData.entries()) {
      formData[key] = value
    }

    const toRemoveCartItemId = formData.removeCartItem
    const quantity = Number(formData.quantity)

    if (toRemoveCartItemId) {
      await removeCartItem(toRemoveCartItemId)
      return redirect('/checkout/cart')
    }

    if (quantity) {
      const cartId = formData.cartId
      await updateQuantityOfCartItem(cartId, quantity)

      return redirect('/checkout/cart')
    }

    return null
  }

  if (actionObject.hasOwnProperty(method)) {
    return actionObject[method](args)
  }

  return null
}

const CartPage = () => {
  const transition = useTransition()
  const data = useLoaderData<LoaderData>()
  const optimisticDeleteCartItemCondition = (cartItemId: string) => {
    return (
      (transition.state === 'submitting' || transition.state === 'loading') &&
      transition.submission &&
      transition.submission.formData.get('removeCartItem') === cartItemId
    )
  }

  return (
    <div className="min-h-[90vh]">
      {data.cartItems.length > 0 ? (
        <>
          <h1 className="mt-5 text-xl font-bold sm:text-3xl text-slate-700">
            Shopping Cart
          </h1>
          <div className="grid grid-cols-12 lg:gap-x-16">
            <div className="col-span-12 lg:col-span-7 xl:col-span-8">
              {data.cartItems.map((cartItem) =>
                optimisticDeleteCartItemCondition(cartItem.id) ? null : (
                  <CartItemComponent key={cartItem.id} cartItem={cartItem} />
                )
              )}
            </div>
            <div className="col-span-12 mt-8 lg:mt-0 lg:col-span-5 xl:col-span-4">
              <Outlet />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <h1 className="mt-5 mb-3 text-6xl font-bold text-center text-slate-700">
            Cart is Empty
          </h1>
          <Link to="/">
            <button className="mt-4 btn btn-outline btn-primary">
              Browse products
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default CartPage
