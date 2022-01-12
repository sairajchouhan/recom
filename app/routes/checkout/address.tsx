import { useState } from 'react'
import {
  ActionFunction,
  json,
  LoaderFunction,
  Outlet,
  useActionData,
  useLoaderData,
} from 'remix'
import AddressModal from '~/components/AddressModal'
import { ActionMethods } from '~/types'
import { createActionObject } from '~/utils/helpers'
import { db } from '~/utils/server/db.server'
import { getUserIdFromSession, logout } from '~/utils/server/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserIdFromSession(request)
  if (!userId) {
    return await logout(request)
  }

  const addresses = await db.userAddress.findMany({
    where: {
      userId,
    },
  })

  return {
    addresses,
  }
}

export const action: ActionFunction = async (args) => {
  const method = args.request.method as keyof ActionMethods
  const actionObject = createActionObject()
  const userId = await getUserIdFromSession(args.request)
  if (!userId) {
    return await logout(args.request)
  }

  actionObject.POST = async ({ request }) => {
    const rawFormData = await request.formData()
    const formData: any = {}
    for (let [key, value] of rawFormData.entries()) {
      formData[key] = value
    }
    const generateRandomData = formData.randomData
    const addAddress = formData.addAddress

    if (generateRandomData) {
      const resp = await fetch(
        'https://random-data-api.com/api/address/random_address'
      )
      const data = await resp.json()

      const returnData = {
        name: data.community,
        country: data.country,
        zip: data.postcode,
        address: {
          primaryAddress: data.street_address,
          secondaryAddress: data.secondary_address,
        },
        city: data.city,
        state: data.state,
      }
      return json(returnData)
    }

    console.log(formData)

    if (addAddress) {
      // const makeDefault = formData.defaultAddress === 'on'
      const newAddress = await db.userAddress.create({
        data: {
          addressLine1: formData.addressLine1 as string,
          addressLine2: formData.addressLine2 as string,
          city: formData.city as string,
          country: formData.country as string,
          name: formData.name as string,
          state: formData.state as string,
          zip: formData.zip as string,
          userId,
        },
      })

      return json({ address: newAddress })
    }

    return null
  }

  if (actionObject.hasOwnProperty(method)) {
    return actionObject[method](args)
  }

  return null
}

const AddressPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const data = useLoaderData()
  const actionData = useActionData()

  return (
    <div className="min-h-[90vh]">
      <>
        <h1 className="mt-5 text-xl font-bold sm:text-3xl text-slate-700">
          Select address
        </h1>

        <AddressModal
          generatedData={actionData}
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
        />
        <div className="grid grid-cols-12 lg:gap-x-16">
          <div className="col-span-12 lg:col-span-7 xl:col-span-8">
            <button
              className="btn btn-primary btn-outline btn-sm"
              onClick={() => setIsOpen(true)}
            >
              Add new Address
            </button>
            {data?.addresses?.map((address: any) => (
              <div className="border ">
                <div className="">
                  <p className="font-semibold">{address.name}</p>
                  <p>
                    {address.addressLine1}, {address.addressLine2}
                  </p>
                  <p>
                    {address.state}, {address.city} - {address.zip}
                  </p>
                  <p>{address.country}</p>
                </div>
                <div className="flex items-center ">
                  <button className="btn btn-link ">Make as default</button>
                  <button className="btn btn-outline btn-secondary">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-span-12 mt-8 lg:mt-0 lg:col-span-5 xl:col-span-4">
            <Outlet />
          </div>
        </div>
      </>
    </div>
  )
}

export default AddressPage
