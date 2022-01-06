import { DataFunctionArgs, AppData } from '@remix-run/server-runtime'
export interface LoginFormFields {
  email: string
  password: string
}
export interface SignupFormFields extends LoginFormFields {}

export interface LoginActionData {
  errors?: Partial<LoginFormFields>
}

export interface SignupActionData extends LoginActionData {
  fields?: {
    email: string
    password: string
  }
}

export interface ActionMethods {
  POST: 'POST'
  PUT: 'PUT'
  DELETE: 'DELETE'
}

export interface ActionObject {
  POST: (
    args: DataFunctionArgs
  ) => Promise<Response> | Response | Promise<AppData> | AppData
  PUT: (
    args: DataFunctionArgs
  ) => Promise<Response> | Response | Promise<AppData> | AppData
  DELETE: (
    args: DataFunctionArgs
  ) => Promise<Response> | Response | Promise<AppData> | AppData
}
