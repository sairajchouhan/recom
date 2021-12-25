import { Link, Form, json, useActionData } from 'remix'
import type { ActionFunction } from 'remix'
import { createUserSession, login } from '~/utils/session.server'
import { validateEmailPassword } from '~/utils/validations'
import { LoginActionData } from '~/types'

export const action: ActionFunction = async ({ request }) => {
  const raw_form_data = await request.formData()
  let form_data: any = {}

  for (let item of raw_form_data.entries()) {
    form_data[item[0]] = item[1]
  }

  const errors = validateEmailPassword(form_data)
  if (Object.keys(errors).length > 0) {
    return json<LoginActionData>(
      {
        errors,
      },
      400
    )
  }

  const user = await login({
    email: form_data.email,
    password: form_data.password,
  })
  console.log(user)
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
  const action_data = useActionData<LoginActionData>()
  return (
    <div className="min-h-[90vh]">
      <div className="w-11/12 mx-auto mt-16 sm:w-3/4 md:w-1/2 lg:w-1/3">
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
            {action_data?.errors?.email ? (
              <div className="text-sm italic text-red-500">
                *{action_data.errors.email}
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
            {action_data?.errors?.password ? (
              <div className="text-sm italic text-red-500">
                *{action_data.errors.password}
              </div>
            ) : null}
          </div>
          <button type="submit" className="block w-full mt-5 btn btn-primary">
            Login
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
