const CartSummary = ({ data }: { data: any }) => {
  return (
    <div className="p-6 rounded-md shadow-sm bg-blue-50/60">
      <h3 className="mb-4 text-lg font-medium text-slate-700">Order Summary</h3>

      <div className="grid grid-cols-1 divide-y">
        <div className="flex items-center justify-between py-3 text-slate-600">
          <h6>Total Items</h6>
          <p>{data?.totalItems}</p>
        </div>
        <div className="flex items-center justify-between py-3 text-slate-600">
          <h6>Total Items Price</h6>
          <p>{data?.totalPriceForProducts}</p>
        </div>
        <div className="flex items-center justify-between py-3 text-slate-600">
          <h6>Delivery Charge</h6>
          <p>${data?.deliveryCharge}</p>
        </div>
        <div className="flex items-center justify-between py-3 text-slate-600">
          <h6>Tax</h6>
          <p>${data?.tax}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-lg font-medium">
        <h3 className="sm:mt-4 text-slate-700">Order Total</h3>
        <p>${data?.total}</p>
      </div>
    </div>
  )
}

export default CartSummary
