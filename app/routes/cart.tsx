import {
  ActionFunction,
  json,
  LoaderFunction,
  Outlet,
  useLoaderData,
} from 'remix'
import { ActionMethods } from '~/types'
import { createActionObject } from '~/utils/helpers'
import { db } from '~/utils/server/db.server'
import { getUserIdFromSession, logout } from '~/utils/server/session.server'
import type { CartItem, Product } from '@prisma/client'

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
  })

  return json({
    cartItems,
  })
}

export const action: ActionFunction = (args) => {
  const method = args.request.method as keyof ActionMethods

  const actionObject = createActionObject()

  actionObject.POST = () => {
    return json({
      hi: 'there',
    })
  }

  if (actionObject.hasOwnProperty(method)) {
    return actionObject[method](args)
  }

  return null
}

const CartPage = () => {
  const data = useLoaderData<LoaderData>()

  return (
    <div className="min-h-[90vh]">
      <h1 className="mt-5 mb-3 text-3xl font-bold text-slate-700">
        Shopping Cart
      </h1>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 ">
          {data.cartItems.map((cartItem) => (
            <div key={cartItem.id} className="pt-6 ">
              <div className="grid grid-cols-12">
                <div className="col-span-2">
                  {/* // TODO: image url should not be null change the schema*/}
                  <div className="overflow-hidden rounded-md">
                    <img src={cartItem.product.imageUrl as string} alt="" />
                  </div>
                </div>
                <div className="flex flex-col col-span-10 px-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-medium text-slate-700">
                        {cartItem.product.name}
                      </p>
                      <p className="text-slate-500">
                        {cartItem.product.color}
                        <span className="mx-2">|</span>
                        {cartItem.size}
                      </p>
                    </div>
                    <p className="text-lg font-medium text-slate-700">
                      ${cartItem.product.price}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <select className="select select-bordered select-sm">
                        {Array.from({ length: 6 }).map((_, i) =>
                          i !== 0 ? (
                            <option value={i} key={i} selected={i === 1}>
                              {i}
                            </option>
                          ) : null
                        )}
                      </select>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-outline btn-error">
                        remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <span className="block h-[1px] bg-slate-200 mt-6"></span>
            </div>
          ))}
        </div>
        <div className="col-span-4 ">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default CartPage
