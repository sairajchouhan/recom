import {
  ShoppingCartIcon,
  UserIcon,
  LogoutIcon,
} from '@heroicons/react/outline'
import { Form, Link } from 'remix'

const Header = ({ rootData }: { rootData: any }) => {
  return (
    <header className="mb-2 border-b navbar">
      <div className="px-2 mx-2 navbar-start">
        <Link to="/">
          <span className="text-2xl font-bold">Recom</span>
        </Link>
      </div>

      <div className="navbar-end text-neutral">
        {rootData?.isAuthenticated ? (
          <>
            <Form method="post" action="/api/logout" reloadDocument>
              <button
                className="btn btn-ghost btn-square hover:bg-zinc-100"
                type="submit"
              >
                <LogoutIcon className="w-6" />
              </button>
            </Form>
            <Link to="/account">
              <button
                title="Profile"
                className="btn btn-square btn-ghost hover:bg-zinc-100"
              >
                <UserIcon className="w-6" />
              </button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/signup">
              <button className="btn btn-ghost hover:bg-zinc-100">
                Signup
              </button>
            </Link>
            <Link to="/login">
              <button className="btn btn-ghost hover:bg-zinc-100">Login</button>
            </Link>
          </>
        )}

        <button
          title="Cart"
          className="relative btn btn-square btn-ghost hover:bg-zinc-100"
        >
          {rootData?.isAuthenticated && rootData?.cartItemsCount > 0 ? (
            <div className="absolute w-4 h-4 rounded-full bg-primary text-primary-content top-1 right-1">
              <span className="text-xs">{rootData?.cartItemsCount}</span>
            </div>
          ) : null}

          <ShoppingCartIcon className="w-6" />
        </button>
      </div>
    </header>
  )
}

export default Header
{
  /* <div className="hidden px-2 mx-2 navbar-center lg:flex">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="h-10 w-96 input input-bordered"
          />
        </div>
      </div> */
}
