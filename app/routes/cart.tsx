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
import { ActionMethods } from '~/types'
import { createActionObject } from '~/utils/helpers'
import { db } from '~/utils/server/db.server'
import { getUserIdFromSession, logout } from '~/utils/server/session.server'
import type { CartItem, Product } from '@prisma/client'
import CartItemComponent from '~/components/CartItem'
import { Prisma } from '@prisma/client'
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
  const cartItems = await db.cartItem.findMany({
    where: {
      userCart: {
        userId,
      },
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

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
      const removedCartItem = await db.cartItem.delete({
        where: {
          id: toRemoveCartItemId,
        },
        include: {
          product: {
            select: {
              price: true,
            },
          },
        },
      })

      await db.userCart.update({
        where: {
          id: removedCartItem.userCartId,
        },
        data: {
          totalPrice: {
            decrement: new Prisma.Decimal(removedCartItem.product.price).mul(
              removedCartItem.quantity
            ),
          },
          totalItems: {
            decrement: removedCartItem.quantity,
          },
        },
      })

      return redirect('/cart')
    }

    if (quantity) {
      const cartId = formData.cartId

      const previousCartItem = await db.cartItem.findUnique({
        where: {
          id: cartId,
        },
        select: {
          quantity: true,
        },
      })

      if (!previousCartItem) {
        return redirect('/cart')
      }

      const updatedCartItem = await db.cartItem.update({
        where: {
          id: cartId,
        },
        data: {
          quantity,
        },
        include: {
          product: {
            select: {
              price: true,
            },
          },
        },
      })

      const changeInQuantity =
        updatedCartItem.quantity - previousCartItem.quantity

      let totalPriceUpdate: any = {}
      let totalQuantityUpdate: any = {}

      if (changeInQuantity > 0) {
        totalPriceUpdate = {
          increment: new Prisma.Decimal(updatedCartItem.product.price).mul(
            changeInQuantity
          ),
        }
        totalQuantityUpdate = {
          increment: changeInQuantity,
        }
      }
      if (changeInQuantity < 0) {
        totalPriceUpdate = {
          decrement: new Prisma.Decimal(updatedCartItem.product.price)
            .mul(changeInQuantity)
            .mul(-1),
        }
        totalQuantityUpdate = {
          decrement: -1 * changeInQuantity,
        }
      }

      if (changeInQuantity === 0) {
        return redirect('/cart')
      }

      await db.userCart.update({
        where: {
          id: updatedCartItem.userCartId,
        },
        data: {
          totalPrice: totalPriceUpdate,
          totalItems: totalQuantityUpdate,
        },
      })

      return redirect('/cart')
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
          <h1 className="mt-5 mb-3 text-3xl font-bold text-slate-700">
            Shopping Cart
          </h1>
          <div className="grid grid-cols-12 gap-x-16">
            <div className="col-span-8 ">
              {data.cartItems.map((cartItem) =>
                optimisticDeleteCartItemCondition(cartItem.id) ? null : (
                  <CartItemComponent key={cartItem.id} cartItem={cartItem} />
                )
              )}
            </div>
            <div className="col-span-4 ">
              <Outlet
                context={{
                  isLastItem: data.cartItems.length === 1,
                }}
              />
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
