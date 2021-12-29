import { ActionFunction, json } from 'remix'
import { ActionMethods, ActionObject } from '~/types'
import { createActionObject } from '~/utils/helpers'

export const action: ActionFunction = (args) => {
  const method = args.request.method as keyof ActionMethods

  const actionObject = createActionObject()

  actionObject.POST = () => {
    return json({
      hi: 'there',
    })
  }

  if (actionObject.hasOwnProperty(method)) {
    return actionObject[method](args)
  }

  return null
}

const CartPage = () => {
  return <div>cart</div>
}

export default CartPage
