import { useState } from 'react'
import { LoaderFunction, useLoaderData, useCatch } from 'remix'
import type {} from 'remix'
import { RadioGroup } from '@headlessui/react'

import productData from '~/../prisma/data.json'

export const loader: LoaderFunction = ({ params }) => {
  const productId = Number(params.product)
  if (!productId)
    throw new Response('Product not found', {
      status: 404,
    })
  const product = productData.find((p) => p.id === productId)

  return {
    product,
  }
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const ProductDetail = () => {
  const data = useLoaderData()
  console.log(data)
  const [selectedSize, setSelectedSize] = useState(data.product.sizes[0])

  return (
    <div className="min-h-[100vh]">
      <div className="grid grid-cols-12 mt-8 ">
        <div className="col-span-12 md:col-span-6 ">
          <div className="overflow-hidden rounded-lg aspect-w-4 aspect-h-5">
            <img
              src={data.product.url}
              alt={data.product.name}
              className="object-cover object-center w-full h-full mx-auto"
            />
          </div>
        </div>
        <div className="col-span-12 px-6 mt-8 space-y-8 md:col-span-6 md:mt-0">
          {/* /1 */}
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">{data.product.name}</h2>
            <p className="text-xl font-semibold">${data.product.price}</p>
          </div>
          {/* 2 */}
          <div className="flex flex-col ">
            <h3 className="mb-1 font-medium text-zinc-700">Size</h3>
            <RadioGroup
              value={selectedSize}
              onChange={setSelectedSize}
              className=""
            >
              <RadioGroup.Label className="sr-only">
                Choose a size
              </RadioGroup.Label>
              <div className="grid grid-cols-5 gap-4">
                {data.product.sizes.map((size: any) => (
                  <RadioGroup.Option
                    key={size.name}
                    value={size}
                    disabled={!size.inStock}
                    className={({ active }) =>
                      classNames(
                        'bg-white shadow-sm text-gray-900 cursor-pointer group relative border rounded-md p-3 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6',
                        active ? 'ring-2 ring-primary' : ''
                      )
                    }
                  >
                    {({ active, checked }) => (
                      <>
                        <RadioGroup.Label as="p">{size.name}</RadioGroup.Label>
                        <div
                          className={classNames(
                            active ? 'border' : 'border-2',
                            checked ? 'border-primary' : 'border-transparent',
                            'absolute -inset-px rounded-md pointer-events-none'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
          {/* 3 */}
          <div className="grid grid-cols-2 gap-4">
            <button className="col-span-2 md:col-span-1 btn btn-primary btn-outline">
              Buy Now
            </button>
            <button className="col-span-2 md:col-span-1 btn btn-primary">
              Add to Cart
            </button>
          </div>
          {/* 4 */}
          <div>
            <h3 className="mb-1 font-medium text-zinc-700">Description</h3>
            <ul className="list-disc list-inside">
              {data.product.description.split('-').map((item: string) => (
                <li className="text-zinc-500">{item}</li>
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

export default ProductDetail
