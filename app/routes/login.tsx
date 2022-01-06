import { Link, Form, json, useActionData, useTransition } from 'remix'
import type { ActionFunction } from 'remix'
import { createUserSession, login } from '~/utils/server/session.server'
import { validateEmailPassword } from '~/utils/validations'
import { LoginActionData } from '~/types'

export const action: ActionFunction = async ({ request }) => {
  const rawFormData = await request.formData()
  let formData: any = {}

  for (let item of rawFormData.entries()) {
    formData[item[0]] = item[1]
  }

  const errors = validateEmailPassword(formData)
  if (Object.keys(errors).length > 0) {
    return json<LoginActionData>(
      {
        errors,
      },
      400
    )
  }

  const user = await login({
    email: formData.email,
    password: formData.password,
  })
  if (!user) {
    return json<LoginActionData>(
      {
        errors: {
          email: 'Email or password is incorrect',
          password: 'Email or password is incorrect',
        },
      },
      400
    )
  }

  return createUserSession(user.id, '/')
}

const Login = () => {
  const actionData = useActionData<LoginActionData>()
  const transition = useTransition()

  const loading =
    (transition.state === 'submitting' || transition.state === 'loading') &&
    transition.submission?.formData.get('submitType') === 'login'

  return (
    <div className="min-h-[90vh]">
      <h1 className="my-6 text-6xl text-center text-primary">Login</h1>
      <div className="w-11/12 mx-auto sm:w-3/4 md:w-1/2 lg:w-1/3">
        <Form method="post">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="jhon@gmail.com"
              className="input input-primary input-bordered"
            />
            {actionData?.errors?.email ? (
              <div className="text-sm italic text-red-500">
                *{actionData.errors.email}
              </div>
            ) : null}
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="your password"
              className="input input-primary input-bordered"
            />
            {actionData?.errors?.password ? (
              <div className="text-sm italic text-red-500">
                *{actionData.errors.password}
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            name="submitType"
            value="login"
            disabled={loading}
            className="block w-full mt-5 btn btn-primary"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </Form>
        <div className="mt-4">
          <p className="text-sm text-center">
            Don't have an account?{' '}
            <Link className="link link-hover text-primary" to="/signup">
              SignUp
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
