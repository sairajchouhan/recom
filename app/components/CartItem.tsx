import { CartItem, Product } from '@prisma/client'
import { Form } from 'remix'

const CartItem = ({
  cartItem,
}: {
  cartItem: CartItem & { product: Product }
}) => {
  return (
    <div key={cartItem.id} className="pt-6 ">
      <div className="grid grid-cols-12">
        <div className="col-span-2">
          {/* // TODO: image url should not be null change the schema*/}
          <div className="overflow-hidden rounded-md">
            <img
              src={cartItem.product.imageUrl as string}
              alt={cartItem.product.name}
            />
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
            <Form method="post" className="flex items-center justify-between">
              <select
                name="quantity"
                className="select select-bordered select-sm"
              >
                {Array.from({ length: 6 }).map((_, i) =>
                  i !== 0 ? (
                    <option value={i} key={i} defaultValue={1}>
                      {i}
                    </option>
                  ) : null
                )}
              </select>
            </Form>
            <Form id="removeCartItemForm" method="post">
              <button
                type="submit"
                className="btn btn-sm btn-outline btn-error"
                name="removeCartItem"
                value={cartItem.id}
                form="removeCartItemForm"
              >
                remove
              </button>
            </Form>
          </div>
        </div>
      </div>
      <span className="block h-[1px] bg-slate-200 mt-6"></span>
    </div>
  )
}

export default CartItem
