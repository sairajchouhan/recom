import { Link } from 'remix'
import type { MetaFunction } from 'remix'
import data from '../../prisma/data.json'

export let meta: MetaFunction = () => {
  return {
    title: 'Recom',
    description: 'Welcome to Recom',
  }
}

// this is just awesome
const product = data[0]

export default function Index() {
  return (
    <div className="">
      <h2 className="mt-6 text-2xl text-gray-900">Recommended Products</h2>

      <div className="grid grid-cols-1 mt-6 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {data.map((product) => (
          <div key={product.id} className="relative group">
            <div className="w-full overflow-hidden bg-gray-200 rounded-md min-h-80 aspect-w-1 aspect-h-1 group-hover:opacity-80 lg:h-80 lg:aspect-none">
              <img
                src={product.url}
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

      {/* <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre> */}
    </div>
  )
}
