import React from "react";
import {
  Home,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Users,
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
      <div className="min-h-screen bg-gray-50 flex">
        <aside className="sticky top-0 h-screen w-64 bg-[#2C2C2C] text-white flex flex-col">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl text-[#FF6B35] tracking-tight">
              ChopStack
            </h1>
            <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
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
                      <Link to={item.to} className={itemClassName}>
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleComingSoon(item.label)}
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
            >
              <Home className="h-4 w-4" />
              <span>View Site</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <h1 className="text-3xl text-[#2C2C2C] mb-8">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
