import { CartItem, Product } from '@prisma/client'
import { Form, Link, useSubmit } from 'remix'

const CartItem = ({
  cartItem,
}: {
  cartItem: CartItem & { product: Product }
}) => {
  const submit = useSubmit()

  return (
    <div key={cartItem.id} className="w-full pt-8">
      <div className="grid grid-cols-12">
        <div className="col-span-12 bg-green-100 sm:col-span-2">
          {/* // TODO: image url should not be null change the schema*/}
          <div className="overflow-hidden rounded-md">
            <Link to={`/product/${cartItem.product.id}?size=${cartItem.size}`}>
              <img
                src={cartItem.product.imageUrl as string}
                alt={cartItem.product.name}
              />
            </Link>
          </div>
        </div>
        <div className="flex flex-col col-span-12 px-6 sm:col-span-10">
          <div className="flex items-start justify-between mt-4">
            <div className="">
              <Link
                to={`/product/${cartItem.product.id}?size=${cartItem.size}`}
              >
                <p className="text-lg font-medium text-slate-700">
                  {cartItem.product.name}
                </p>
              </Link>
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
          <div className="flex items-center justify-between mt-6 sm:mt-auto ">
            <Form
              method="post"
              action="/cart"
              className="flex items-center justify-between"
              onChange={(e: React.ChangeEvent<HTMLFormElement>) => {
                submit(e.currentTarget, {
                  action: '/cart',
                  method: 'post',
                })
              }}
            >
              <select
                name="quantity"
                className="select select-bordered select-sm"
                defaultValue={cartItem.quantity}
              >
                {Array.from({ length: 6 }).map((_, i) =>
                  i !== 0 ? (
                    <option value={i} key={i}>
                      {i}
                    </option>
                  ) : null
                )}
              </select>
              <input
                type="text"
                hidden
                name="cartId"
                defaultValue={cartItem.id}
              />
            </Form>
            <Form method="post" action="/cart">
              <button
                type="submit"
                className="btn btn-sm btn-outline btn-error"
                name="removeCartItem"
                value={cartItem.id}
              >
                remove
              </button>
            </Form>
          </div>
        </div>
      </div>
      <span className="block h-[1px] bg-slate-200 mt-8"></span>
    </div>
  )
}

export default CartItem
