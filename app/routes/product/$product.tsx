import { useState } from 'react'
import {
  LoaderFunction,
  ActionFunction,
  useLoaderData,
  useCatch,
  Form,
  json,
  useSearchParams,
  useTransition,
  useNavigate,
  useActionData,
  Link,
} from 'remix'
import { RadioGroup } from '@headlessui/react'

import { cls, createActionObject, waitFor } from '~/utils/helpers'
import { db } from '~/utils/server/db.server'
import { ActionMethods } from '~/types'
import {
  getUserIdFromSession,
  logout,
  requireUserSession,
} from '~/utils/server/session.server'
import { addItemToCart } from '~/utils/server/cart.server'
import { Size } from '@prisma/client'

export const loader: LoaderFunction = async ({ params }) => {
  const productId = params.product
  if (!productId) {
    throw new Response('Product not found', {
      status: 404,
    })
  }

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  })

  if (!product) {
    throw new Response('Product not found', {
      status: 404,
    })
  }

  return {
    product,
  }
}

export const action: ActionFunction = async (args) => {
  await requireUserSession(args.request)
  const userId = await getUserIdFromSession(args.request)
  if (!userId) {
    return await logout(args.request)
  }
  const method = args.request.method as keyof ActionMethods
  const actionObject = createActionObject()

  actionObject.POST = async ({ request, params }) => {
    const rawFormData = await request.formData()
    const formData: Record<string, any> = {}

    for (let [key, value] of rawFormData.entries()) {
      formData[key] = value
    }
    const addToCart = formData.addToCart

    if (addToCart) {
      const productId = params.product
      const size: Size = formData.size

      if (!productId || !size) {
        return json(
          {
            error: 'Invalid request',
          },
          {
            status: 400,
          }
        )
      }

      const cartItem = await addItemToCart({
        userId,
        productId,
        size,
      })

      const data = {
        addedToCart: true,
        size: cartItem.size,
      }

      return json(data, {
        status: 201,
      })
    }
  }

  if (actionObject.hasOwnProperty(method)) {
    return actionObject[method](args)
  }

  return null
}

const allSizes = ['XS', 'S', 'M', 'L', 'XL']

const ProductDetailPage = () => {
  const transition = useTransition()
  const data = useLoaderData()
  const actionData = useActionData()
  const [url] = useSearchParams()

  const [selectedSize, setSelectedSize] = useState(
    allSizes[allSizes.indexOf(url.get('size') ?? 'M')]
  )

  return (
    <div className="min-h-[100vh]">
      <div className="grid grid-cols-12 mt-8 ">
        <div className="col-span-12 md:col-span-6 ">
          <div className="overflow-hidden rounded-lg aspect-w-4 aspect-h-5">
            <img
              src={data.product.imageUrl}
              alt={data.product.name}
              className="object-cover object-center w-full h-full mx-auto"
            />
          </div>
        </div>
        <div className="col-span-12 px-6 mt-8 space-y-8 md:col-span-6 md:mt-0">
          {/* /1 */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{data.product.name}</h2>
              <p className="text-xl font-semibold">${data.product.price}</p>
            </div>
            <p>
              {data.product.color.charAt(0).toUpperCase() +
                data.product.color.slice(1)}
            </p>
          </div>
          {/* 2 */}
          <Form method="post">
            <div className="flex flex-col ">
              <h3 className="mb-1 font-medium text-zinc-700">Size</h3>
              <RadioGroup
                as="fieldset"
                value={selectedSize}
                onChange={(val) => {
                  setSelectedSize(val)
                }}
              >
                <RadioGroup.Label className="sr-only">
                  Choose a size
                </RadioGroup.Label>
                <div className="grid grid-cols-5 gap-x-2 sm:gap-x-4 xl:grid-cols-7">
                  {allSizes.map((size: any) => (
                    <RadioGroup.Option
                      key={size}
                      value={size}
                      as="label"
                      htmlFor={size}
                      className={({ active }) =>
                        cls(
                          'bg-white shadow-sm text-gray-900 cursor-pointer group relative border rounded-md flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none',
                          active ? 'ring-2 ring-primary' : '',
                          'col-span-1',
                          'py-4 '
                        )
                      }
                    >
                      {({ active, checked }) => (
                        <>
                          <RadioGroup.Label as="p">{size}</RadioGroup.Label>
                          <div
                            className={cls(
                              active ? 'border' : 'border-2',
                              checked ? 'border-primary' : 'border-transparent',
                              'absolute -inset-px rounded-md pointer-events-none'
                            )}
                            aria-hidden="true"
                          />
                          <input
                            type="radio"
                            name="size"
                            id={size}
                            value={size}
                            hidden
                            defaultChecked={size === 'M'}
                          />
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            </div>
            {/* 3 */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {actionData?.addedToCart && actionData?.size === selectedSize ? (
                <Link to="/checkout/cart" className="col-span-2 md:col-span-1 ">
                  <button className="w-full btn btn-primary">Go to cart</button>
                </Link>
              ) : (
                <button
                  name="addToCart"
                  value={'addToCart'}
                  className={cls(
                    'col-span-2 md:col-span-1 btn btn-primary',
                    'disabled:bg-current'
                  )}
                  disabled={transition.state === 'submitting'}
                  type="submit"
                >
                  {transition.state === 'submitting'
                    ? 'Adding to cart...'
                    : 'Add to cart'}
                </button>
              )}
            </div>
          </Form>
          {/* 4 */}
          <div>
            <h3 className="mb-1 font-medium text-zinc-700">Details</h3>
            <ul className="list-disc list-inside">
              {data.product.description.split('#').map((item: string) => (
                <li key={item} className="text-zinc-500">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export const CatchBoundary = () => {
  const res = useCatch()
  if (res.status === 404) {
    return (
      <div>
        <h1>404</h1>
        <p>Product Not found</p>
      </div>
    )
  }
  return <div>Error...</div>
}

export const ErrorBoundary = (err: any) => {
  console.error(err)
  return <div>Someting went wrong</div>
}

export default ProductDetailPage
