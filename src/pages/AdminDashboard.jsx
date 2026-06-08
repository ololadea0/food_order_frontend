import React, { useEffect, useMemo, useState } from "react";
import { Package, ShoppingBag, Users } from "lucide-react";
import { toast } from "react-toastify";
import axios from "../services/axiosInstance";
import Spinner from "../components/Spinner";
import AdminLayout from "../components/AdminLayout";

const statusStyles = {
  delivered: "bg-green-100 text-green-800",
  pending: "bg-orange-100 text-orange-800",
  preparing: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
  "out for delivery": "bg-blue-100 text-blue-800",
};

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    foods: [],
    orders: [],
    users: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const [foodsResponse, ordersResponse, usersResponse] =
          await Promise.all([
            axios.get("/foods"),
            axios.get("/orders"),
            axios.get("/users"),
          ]);

        setDashboardData({
          foods: foodsResponse.data || [],
          orders: ordersResponse.data || [],
          users: usersResponse.data || [],
        });
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Unable to load admin dashboard data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const totalOrders = dashboardData.orders.length;
    const totalRevenue = dashboardData.orders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0,
    );

    return {
      totalOrders,
      totalRevenue,
      totalProducts: dashboardData.foods.length,
      totalUsers: dashboardData.users.length,
    };
  }, [dashboardData]);

  const recentOrders = useMemo(
    () => dashboardData.orders.slice(0, 5),
    [dashboardData.orders],
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-3xl text-[#2C2C2C]">
            {stats.totalOrders.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <span className="text-white text-xl font-semibold">₦</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-3xl text-[#2C2C2C]">
            ₦{stats.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Products</p>
          <p className="text-3xl text-[#2C2C2C]">
            {stats.totalProducts.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-3xl text-[#2C2C2C]">
            {stats.totalUsers.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl text-[#2C2C2C]">Recent Orders</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-sm text-gray-600"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C2C2C]">
                      {order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C2C2C]">
                      {order.user?.name || order.user?.email || "Unknown"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C2C2C]">
                      ₦{Number(order.totalPrice || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          statusStyles[order.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
