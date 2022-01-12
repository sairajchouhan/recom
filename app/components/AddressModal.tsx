import { Fragment } from 'react'
import { Transition, Dialog } from '@headlessui/react'
import { Form } from 'remix'

const AddressModal = ({
  generatedData,
  closeModal,
  isOpen,
}: {
  generatedData: any
  closeModal: any
  isOpen: boolean
}) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/50 " />
            </Transition.Child>
            {/* <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span> */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-lg max-h-screen p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add Address
                </Dialog.Title>
                <div className="mt-2">
                  <Form
                    action="/checkout/address"
                    method="post"
                    className="space-y-2"
                  >
                    <AddressInput
                      name="name"
                      defaultValue={generatedData?.name}
                      label="Name"
                    />
                    <AddressInput
                      label="Country"
                      name="country"
                      defaultValue={generatedData?.country}
                    />
                    <AddressInput
                      label="ZIP"
                      name="zip"
                      defaultValue={generatedData?.zip}
                    />
                    <AddressInput
                      label="Address"
                      name="addressLine1"
                      defaultValue={generatedData?.address.primaryAddress}
                      placeholder="Street address, or P.O. BOx"
                    >
                      <input
                        type="text"
                        name="addressLine2"
                        defaultValue={generatedData?.address.secondaryAddress}
                        placeholder="Apt, suite, unit, building, floor, etc."
                        className="w-full mt-5 input input-sm input-primary"
                      />
                    </AddressInput>
                    <AddressInput
                      label="City"
                      name="city"
                      defaultValue={generatedData?.city}
                    />
                    <AddressInput
                      label="State"
                      name="state"
                      defaultValue={generatedData?.state}
                    />
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="defaultAddress"
                        className="checkbox checkbox-primary"
                      />
                      <label className="ml-2 label">
                        Make this default address
                      </label>
                    </div>
                    <div className="flex justify-between pt-8">
                      <button
                        name="randomData"
                        value="true"
                        className="btn btn-primary btn-outline btn-sm"
                      >
                        Generate Random Data
                      </button>
                      <button
                        name="addAddress"
                        value="true"
                        className="btn btn-primary btn-sm"
                        onClick={() => closeModal()}
                      >
                        Add
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default AddressModal

interface AddressInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const AddressInput = ({ label, children, ...props }: AddressInputProps) => {
  return (
    <div className="form-control">
      {label ? (
        <label className="py-1 label">
          <span className="label-text">{label}</span>
        </label>
      ) : null}
      <input
        type="text"
        className="w-full input input-sm input-primary"
        {...props}
      />
      {children}
    </div>
  )
}

/*
country
state
city
postcode

*/
