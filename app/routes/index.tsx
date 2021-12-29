import { Link, useLoaderData } from 'remix'
import type { MetaFunction, LoaderFunction } from 'remix'
import data from '../../prisma/data.json'
import { db } from '~/utils/db.server'
import { Product } from '@prisma/client'

export let meta: MetaFunction = () => {
  return {
    title: 'Recom',
    description: 'Welcome to Recom',
  }
}

export const loader: LoaderFunction = async () => {
  const products = await db.product.findMany({})
  return { products }
}

export default function Index() {
  const data = useLoaderData<{ products: Product[] }>()

  return (
    <div className="">
      <h2 className="mt-6 text-2xl text-gray-900">Recommended Products</h2>

      <div className="grid grid-cols-1 mt-6 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {data.products.map((product) => (
          <div key={product.id} className="relative group">
            <div className="w-full overflow-hidden bg-gray-200 rounded-md min-h-80 aspect-w-1 aspect-h-1 group-hover:opacity-80 lg:h-80 lg:aspect-none">
              <img
                src={product.url ?? undefined}
                alt={product.name}
                className="object-cover object-center w-full h-full lg:w-full lg:h-full"
              />
            </div>
            <div className="flex justify-between mt-4">
              <div>
                <h3 className="text-sm text-gray-700">
                  <Link to={`/product/${product.id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{product.color}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">
                ${product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
