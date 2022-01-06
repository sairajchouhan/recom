import { Form, json, Link, redirect, useActionData, useTransition } from 'remix'
import type { ActionFunction } from 'remix'
import { db } from '~/utils/server/db.server'
import { createUserSession, signup } from '~/utils/server/session.server'
import { validateEmailPassword } from '~/utils/validations'
import { SignupActionData } from '~/types'
import { createUserCart } from '~/utils/server/cart.server'

export const action: ActionFunction = async ({ request }) => {
  const rawFormData = await request.formData()
  let formData: any = {}

  for (let item of rawFormData.entries()) {
    formData[item[0]] = item[1]
  }

  if (formData.generateCredentials) {
    const resp = await fetch(
      'https://random-data-api.com/api/users/random_user'
    )
    const data = await resp.json()
    return json({
      fields: {
        email: data.email,
        password: data.password,
      },
    })
  }

  const errors = validateEmailPassword(formData)
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
      email: formData.email,
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

  const user = await signup({
    email: formData.email,
    password: formData.password,
  })

  await createUserCart({ userId: user.id })

  return createUserSession(user.id, '/')
}

const Signup = () => {
  const actionData = useActionData<SignupActionData>()
  const transition = useTransition()

  const loading =
    (transition.state === 'submitting' || transition.state === 'loading') &&
    transition.submission?.formData.get('submitType') === 'signup'

  return (
    <div className="min-h-[90vh]">
      <h1 className="my-6 text-6xl text-center text-primary">Sign Up</h1>
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
              defaultValue={actionData?.fields && actionData?.fields?.email}
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
              defaultValue={actionData?.fields && actionData?.fields?.password}
              className="input input-primary input-bordered"
            />
            {actionData?.errors?.password ? (
              <div className="text-sm italic text-red-500">
                *{actionData.errors.password}
              </div>
            ) : null}
          </div>
          <button
            name="submitType"
            value="signup"
            type="submit"
            disabled={loading}
            className="block w-full mt-5 btn btn-primary"
          >
            {loading ? 'Signing up...' : 'Signup'}
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
        <div className="py-4 mt-6 text-center bg-gray-100 rounded-md">
          <p className="">
            Creating a new account is borring let so let me help you 👇{' '}
          </p>
          <Form method="post">
            <button
              name="generateCredentials"
              value="true"
              type="submit"
              className="text-primary hover:underline "
            >
              {transition.submission?.formData.get('generateCredentials') ===
              'true'
                ? 'Generating credentials...'
                : 'Click here to generate random credentials'}
            </button>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Signup
