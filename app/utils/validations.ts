export const validateEmailPassword = (formData: {
  email?: string
  password?: string
}) => {
  const errors: {
    email?: string
    password?: string
  } = {}

  if (!formData.email) {
    errors.email = 'Email is required'
  }
  if (!formData.password) {
    errors.password = 'Password is required'
  }

  return errors
}
