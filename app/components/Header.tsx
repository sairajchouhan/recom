import {
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/outline'
import { Link, useSubmit } from 'remix'

const Header = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const handleLogout = () => {}

  return (
    <header className="mb-2 border-b navbar">
      <div className="px-2 mx-2 navbar-start">
        <Link to="/">
          <span className="text-2xl font-bold">Recom</span>
        </Link>
      </div>

      <div className="navbar-end text-neutral">
        {isAuthenticated ? (
          <>
            <button
              title="Profile"
              className="btn btn-square btn-ghost hover:bg-zinc-100"
            >
              <UserIcon className="w-6" />
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-outline btn-primary"
            >
              Logout
            </button>
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
          className="btn btn-square btn-ghost hover:bg-zinc-100"
        >
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
