import { Link } from 'remix'

const Login = () => {
  return (
    <div className="min-h-[90vh]">
      <div className="w-full mx-auto mt-16 lg:w-1/4">
        <form className="">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
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
              placeholder="your password"
              className="input input-primary input-bordered"
            />
          </div>
          <button type="submit" className="block w-full mt-5 btn btn-primary">
            Login
          </button>
        </form>
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
