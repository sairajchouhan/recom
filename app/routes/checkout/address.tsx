import { Outlet } from 'remix'

const AddressPage = () => {
  return (
    <div className="min-h-[90vh]">
      <>
        <h1 className="mt-5 text-xl font-bold sm:text-3xl text-slate-700">
          Select address
        </h1>
        <div className="grid grid-cols-12 lg:gap-x-16">
          <div className="col-span-12 lg:col-span-7 xl:col-span-8">yo man</div>
          <div className="col-span-12 mt-8 lg:mt-0 lg:col-span-5 xl:col-span-4">
            <Outlet />
          </div>
        </div>
      </>
    </div>
  )
}

export default AddressPage
