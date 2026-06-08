import React from "react";
import { LayoutDashboard, Search, ShoppingCart, User, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, reset } from "../slice/authSlice";
import { clearSearchTerm, setSearchTerm } from "../slice/foodSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const searchTerm = useSelector((state) => state.food.searchTerm);

  const totalCartQuantity = cartItems.reduce(
    (acc, item) => acc + (item.qty || 0),
    0,
  );

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(reset());
    navigate("/login");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const handleClearSearch = () => {
    dispatch(clearSearchTerm());
  };

  return (
    <nav className="text-white shadow-md px-4 py-2 mb-4 w-full sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl text-[#ff6b35] tracking-tight">
              ChopStack
            </h1>
          </Link>

          <form
            className="relative flex-1 max-w-xl"
            onSubmit={handleSearchSubmit}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF3b35] focus:border-transparent text-black placeholder-gray-400"
              placeholder="Search for food"
              role="textbox"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6B35] transition-colors"
                aria-label="Clear search"
                onClick={handleClearSearch}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="text-[#2c2c2c] h-6 w-6 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalCartQuantity}
              </span>
            </Link>

            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="w-full flex items-center gap-3 p-3 border border-gray-300 text-[#2C2C2C] rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Admin</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <User className="text-[#ff6b35]" />
                    <Link
                      to="/profile"
                      className="text-[#2c2c2c] font-medium cursor-pointer"
                    >
                      {user.name || user.email}
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-[#ff6b35] hover:text-[#ff5722] transition-colors font-medium cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-[#2C2C2C] text-white rounded-lg hover:bg-[#3c3c3c] transition-colors duration-300 cursor-pointer"
                  role="button"
                  name="Login"
                >
                  <User />
                  <span>Login</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
