import { useState } from "react";
import { useApp } from "../context/AppContext";
import { FiShoppingCart, FiSearch, FiMenu, FiX } from "react-icons/fi";
import NotificationBell from "./NotificationBell";

export default function Navbar({ currentPage, navigate }) {
  const { user, cartCount } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isAdmin = user?.role?.toLowerCase?.() === "admin";

  const links = [
    { label: "Home", page: "home" },
    { label: "Menu", page: "menu" },
    { label: "Orders", page: "orders" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate("menu");
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        <button
          onClick={() => navigate("home")}
          className="flex items-center gap-2 flex-shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center transition-transform group-hover:scale-105">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M12 2C8 2 4 5.5 4 10c0 2.5 1.2 4.7 3 6.2V20a1 1 0 001 1h8a1 1 0 001-1v-3.8c1.8-1.5 3-3.7 3-6.2C20 5.5 16 2 12 2z"
                fill="currentColor"
                opacity=".9"
              />
              <path
                d="M9 21v1a1 1 0 001 1h4a1 1 0 001-1v-1H9z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span
            className="text-stone-900 text-lg font-semibold hidden sm:block"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Cravings
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {links.map((link) => (
            <button
              key={link.page}
              onClick={() => navigate(link.page)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? "bg-orange-50 text-orange-600"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex flex-1 max-w-sm ml-2"
        >
          <div className="relative w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">
              <FiSearch className="text-sm" aria-hidden="true" />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meals..."
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-stone-100 border border-transparent text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-colors"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 ml-auto">
          <NotificationBell navigate={navigate} />
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="lg:hidden p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Search"
          >
            <FiSearch className="text-sm" aria-hidden="true" />
          </button>
          <button
            onClick={() => navigate("cart")}
            className={`relative p-2 rounded-lg transition-colors ${
              currentPage === "cart"
                ? "text-orange-600 bg-orange-50"
                : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            }`}
            aria-label={`Cart (${cartCount} items)`}
          >
            <FiShoppingCart className="text-lg" aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
          {user ? (
            <button
              onClick={() => navigate("profile")}
              className={`ml-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2 ${
                currentPage === "profile"
                  ? "bg-orange-500 text-white border-orange-400"
                  : "bg-stone-100 text-stone-700 border-stone-200 hover:border-orange-300"
              }`}
              aria-label="Profile"
            >
              {(user.name || "U").charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              onClick={() => navigate("auth")}
              className="ml-1 hidden sm:flex items-center gap-1.5 h-8 px-3.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Sign in
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => navigate("admin")}
              className="hidden sm:inline-flex h-8 px-3 items-center rounded-lg border border-orange-200 text-xs font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
            >
              Admin
            </button>
          )}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden ml-1 p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="lg:hidden border-t border-stone-100 px-4 py-2.5 bg-white">
          <form onSubmit={handleSearchSubmit}>
            <input
              autoFocus
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meals..."
              className="w-full h-9 px-4 rounded-xl bg-stone-100 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
            />
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 space-y-1">
          {links.map((link) => (
            <button
              key={link.page}
              onClick={() => {
                navigate(link.page);
                setMobileOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? "bg-orange-50 text-orange-600"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              {link.label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => {
                navigate("admin");
                setMobileOpen(false);
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold text-orange-600 hover:bg-orange-50"
            >
              Admin
            </button>
          )}
          {!user && (
            <button
              onClick={() => {
                navigate("auth");
                setMobileOpen(false);
              }}
              className="w-full mt-2 h-10 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      )}
    </header>
  );
}
