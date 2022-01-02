import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  Outlet,
  useActionData,
  useLoaderData,
  useMatches,
  useSubmit,
  useTransition,
} from 'remix'
import { ActionMethods } from '~/types'
import { createActionObject } from '~/utils/helpers'
import { db } from '~/utils/server/db.server'
import { getUserIdFromSession, logout } from '~/utils/server/session.server'
import type { CartItem, Product } from '@prisma/client'
import CartItemComponent from '~/components/CartItem'

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
            decrement: removedCartItem.product.price,
          },
          totalItems: {
            decrement: removedCartItem.quantity,
          },
        },
      })

      return json({
        removed: true,
      })
    }

    return null
  }

  if (actionObject.hasOwnProperty(method)) {
    return actionObject[method](args)
  }

  return null
}

const CartPage = () => {
  const submit = useSubmit()
  const transition = useTransition()
  const data = useLoaderData<LoaderData>()

  const handleCartItemDelete = () => {
    submit(null, {
      method: 'post',
    })
  }

  const optimisticDeleteCartItemCondition = (cartItemId: string) => {
    return (
      (transition.state === 'submitting' || transition.state === 'loading') &&
      transition.submission &&
      transition.submission.formData.get('removeCartItem') === cartItemId
    )
  }

  return (
    <div className="min-h-[90vh]">
      <h1 className="mt-5 mb-3 text-3xl font-bold text-slate-700">
        Shopping Cart
      </h1>
      <div className="grid grid-cols-12 gap-x-16">
        <div className="col-span-8 ">
          {data.cartItems.map((cartItem) =>
            optimisticDeleteCartItemCondition(cartItem.id) ? null : (
              <CartItemComponent
                cartItem={cartItem}
                handleCartItemDelete={handleCartItemDelete}
              />
            )
          )}
        </div>
        <div className="col-span-4 ">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default CartPage
