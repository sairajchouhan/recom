import { Form, json, Link, redirect, useActionData } from 'remix'
import type { ActionFunction } from 'remix'
import { db } from '~/utils/server/db.server'
import { signup } from '~/utils/server/session.server'
import { validateEmailPassword } from '~/utils/validations'
import { SignupActionData } from '~/types'

export const action: ActionFunction = async ({ request }) => {
  const raw_form_data = await request.formData()
  let form_data: any = {}

  for (let item of raw_form_data.entries()) {
    form_data[item[0]] = item[1]
  }

  const errors = validateEmailPassword(form_data)
  if (Object.keys(errors).length > 0) {
    return json<SignupActionData>(
      {
        errors,
      },
      400
    )
  }

  const userExists = await db.user.findUnique({
    where: {
      email: form_data.email,
    },
  })

  if (userExists) {
    return json<SignupActionData>(
      {
        errors: {
          email: 'Email is taken, Try another one',
        },
      },
      400
    )
  }

  const user = signup({
    email: form_data.email,
    password: form_data.password,
  })

  return redirect('/')
}

const Signup = () => {
  const action_data = useActionData<SignupActionData>()

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
            SignUp
          </button>
        </Form>
        <div className="mt-4">
          <p className="text-sm text-center">
            Already have an account?{' '}
            <Link className="link link-hover text-primary" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
