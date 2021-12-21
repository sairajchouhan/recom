import {
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/outline'
import { Link } from 'remix'

const Header = () => {
  return (
    <div className="px-8 mb-2 shadow-lg navbar bg-neutral text-neutral-content">
      <div className="px-2 mx-2 navbar-start">
        <Link to="/">
          <span className="text-2xl font-bold">Recom</span>
        </Link>
      </div>
      <div className="hidden px-2 mx-2 navbar-center lg:flex">
        <div className="form-control">
          <input type="text" placeholder="Search" className="w-96 input" />
        </div>
      </div>
      <div className="navbar-end">
        <div>
          <Link className="btn btn-ghost" to="/signup">
            Signup
          </Link>
          <Link className="btn btn-ghost" to="/login">
            Login
          </Link>
        </div>
        <button className="btn btn-square btn-ghost">
          <UserIcon className="w-6" />
        </button>
        <button className="btn btn-square btn-ghost">
          <ShoppingCartIcon className="w-6" />
        </button>
      </div>
    </div>
  )
}

export default Header
