import { ActionObject } from '~/types'

export const cls = (...classes: any) => {
  return classes.filter(Boolean).join(' ')
}

export const createActionObject = () => {
  const actionObject: ActionObject = {
    POST: () => {},
    PUT: () => {},
    DELETE: () => {},
  }
  return actionObject
}
