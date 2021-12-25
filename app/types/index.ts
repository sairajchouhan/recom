export interface LoginFormFields {
  email: string
  password: string
}
export interface SignupFormFields extends LoginFormFields {}

export interface LoginActionData {
  errors?: Partial<LoginFormFields>
}

export interface SignupActionData extends LoginActionData {}
