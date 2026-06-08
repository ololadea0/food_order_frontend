import React, { useState } from "react";
import {
  LayoutDashboard,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartQuantity = cartItems.reduce(
    (acc, item) => acc + (item.qty || 0),
    0,
  );

  const isAdmin = user?.role === "admin";

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(reset());
    closeMobileMenu();
    navigate("/login");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    closeMobileMenu();

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
    <nav className="text-[#2c2c2c] shadow-sm px-4 py-3 mb-4 w-full sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex-shrink-0" onClick={closeMobileMenu}>
            <h1 className="text-2xl font-semibold text-[#ff6b35] tracking-tight">
              ChopStack
            </h1>
          </Link>

          <div className="hidden md:flex flex-1 justify-center">
            <form
              className="relative w-full max-w-2xl"
              onSubmit={handleSearchSubmit}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF3b35] focus:border-transparent text-black placeholder-gray-400"
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
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative p-2 bg-[#f8f8f8] rounded-xl hover:bg-[#f0f0f0] transition-colors"
              onClick={closeMobileMenu}
            >
              <ShoppingCart className="text-[#2c2c2c] h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                {totalCartQuantity}
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-3">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    navigate("/admin/dashboard");
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-[#2c2c2c] rounded-full hover:bg-gray-100 transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Admin</span>
                </button>
              )}

              {user ? (
                <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2">
                  <User className="text-[#ff6b35] h-5 w-5" />
                  <div className="flex flex-col leading-tight">
                    <Link
                      to="/profile"
                      className="text-[#2c2c2c] font-medium hover:text-[#ff6b35] transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {user.name || user.email}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-xs text-[#ff6b35] hover:text-[#ff5722] transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" onClick={closeMobileMenu}>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#2c2c2c] text-white rounded-full hover:bg-[#3c3c3c] transition-colors duration-300">
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </button>
                </Link>
              )}
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl border border-gray-200 bg-white text-[#2c2c2c] shadow-sm hover:bg-[#fafafa] transition-colors md:hidden"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <div className="md:hidden mt-3">
          <form className="relative" onSubmit={handleSearchSubmit}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF3b35] focus:border-transparent text-black placeholder-gray-500"
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
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-4 rounded-3xl border border-gray-200 bg-[#fff7ef] p-4 shadow-sm">
            <div className="space-y-3">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    navigate("/admin/dashboard");
                  }}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#2c2c2c] hover:bg-[#f9f3ef] transition-colors text-left"
                >
                  Admin Dashboard
                </button>
              )}

              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#2c2c2c] hover:bg-[#f9f3ef] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>View Cart</span>
                </div>
                <span className="inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-1 text-[11px] font-semibold text-white">
                  {totalCartQuantity}
                </span>
              </Link>

              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="block rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#2c2c2c] hover:bg-[#f9f3ef] transition-colors"
                  >
                    Manage Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-2xl bg-[#ff6b35] px-4 py-3 text-white hover:bg-[#ff5c2a] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" onClick={closeMobileMenu}>
                  <button className="w-full rounded-2xl bg-[#2c2c2c] px-4 py-3 text-white hover:bg-[#3c3c3c] transition-colors">
                    Login to Order
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
