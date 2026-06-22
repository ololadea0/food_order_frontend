import React, { useState } from "react";
import {
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser, reset } from "../slice/authSlice";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/admin/dashboard",
  },
  {
    label: "Manage Foods",
    icon: Package,
    to: "/admin/foods",
  },
  {
    label: "Manage Orders",
    icon: ShoppingBag,
    to: "/admin/orders",
  },
];

function AdminLayout({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(reset());
    navigate("/login", { replace: true });
  };

  const handleComingSoon = (label) => {
    toast.info(`${label} is coming soon.`);
  };

  return (
    <div id="fig-code-root" style={{ height: "100%" }}>
      <div className="min-h-screen bg-gray-50 md:flex">
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#2C2C2C] text-white flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 md:h-screen ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-[#FF6B35] tracking-tight">
                ChopStack
              </h1>
              <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
            </div>
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md bg-white/10 hover:bg-white/20"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.to && location.pathname === item.to;
                const itemClassName = `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  isActive ? "bg-gray-700" : "hover:bg-gray-700"
                }`;

                return (
                  <li key={item.label}>
                    {item.to ? (
                      <Link
                        to={item.to}
                        className={itemClassName}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          handleComingSoon(item.label);
                          setSidebarOpen(false);
                        }}
                        className={itemClassName}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <div className="mb-3">
              <p className="text-sm text-gray-400">Logged in as</p>
              <p className="text-white">
                {user?.name || user?.email || "Admin User"}
              </p>
            </div>
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-2 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>View Site</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-auto md:ml-64">
          <div className="md:hidden flex items-center gap-3 p-4 bg-white border-b border-gray-200">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md bg-transparent text-black hover:text-[#ff8b56] hover:bg-transparent"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <div>
              <h1 className="text-lg font-semibold text-[#2C2C2C]">{title}</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="hidden md:block">
              <h1 className="text-3xl text-[#2C2C2C] mb-8">{title}</h1>
            </div>
            <div className="md:hidden mt-4">
              <h1 className="text-2xl text-[#2C2C2C] mb-6">{title}</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
