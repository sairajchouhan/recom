import { Form, json, Link } from 'remix'
import type { ActionFunction } from 'remix'
import { db } from '~/utils/db.server'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  let res: any = {}

  for (let item of formData.entries()) {
    res[item[0]] = item[1]
  }

  if (!res.email) {
    return json(
      {
        email: 'Email is required',
      },
      400
    )
  }
  if (!res.password) {
    return json(
      {
        email: 'Password is required',
      },
      400
    )
  }

  const userExists = await db.user.findUnique({
    where: {
      email: res.email,
    },
  })

  if (userExists) {
    return json({ email: 'Email is taken, Try another one' }, 400)
  }

  const user = await db.user.create({
    data: {
      email: res.email,
      password: res.password,
      first_name: res.email.split('@')[0],
    },
  })

  return json({ user }, 201)
}

const Signup = () => {
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
              defaultValue={'sairaj2119@gmail.com'}
              placeholder="jhon@gmail.com"
              className="input input-primary input-bordered"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              defaultValue="aunzbedi"
              placeholder="your password"
              className="input input-primary input-bordered"
            />
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
