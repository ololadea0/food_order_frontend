import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Eye, X } from "lucide-react";
import { toast } from "react-toastify";
import AdminLayout from "../components/AdminLayout";
import Spinner from "../components/Spinner";
import orderService from "../services/orderService";
import { formatCurrency } from "../utils/formatCurrency";
import { getEstimatedOrderWindow } from "../utils/orderTiming";

const statusOptions = [
  "pending",
  "onTheWay",
  "availableForPickup",
  "preparing",
  "delivered",
  "cancelled",
];

const statusClasses = {
  pending: "bg-orange-100 text-orange-800",
  onTheWay: "bg-blue-100 text-blue-800",
  availableForPickup: "bg-emerald-100 text-emerald-800",
  preparing: "bg-yellow-100 text-yellow-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const data = await orderService.getAdminOrders();
        setOrders(data || []);
      } catch (error) {
        toast.error(error.message || "Unable to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const selectedOrder = useMemo(
    () => orders.find((order) => order._id === selectedOrderId) || null,
    [orders, selectedOrderId],
  );
  const selectedOrderWindow = selectedOrder
    ? getEstimatedOrderWindow(selectedOrder.orderItems, selectedOrder.orderType)
    : null;

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const updatedOrder = await orderService.updateAdminOrderStatus(
        orderId,
        nextStatus,
      );

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? updatedOrder : order)),
      );
      toast.success("Order status updated");
    } catch (error) {
      toast.error(error.message || "Unable to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <AdminLayout title="Manage Orders">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <Spinner />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-sm text-gray-600"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C2C2C]">
                      {order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="text-[#2C2C2C]">
                          {order.user?.name || "Unknown customer"}
                        </p>
                        <p className="text-gray-600 text-xs">
                          {order.user?.email || "No email"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C2C2C]">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          order.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Not Paid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative inline-flex">
                        <select
                          value={order.status}
                          disabled={updatingOrderId === order._id}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className={`px-3 py-1 text-xs rounded-full appearance-none pr-8 cursor-pointer ${
                            statusClasses[order.status] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedOrderId((current) =>
                            current === order._id ? null : order._id,
                          )
                        }
                        className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-2xl text-[#2C2C2C]">Order Details</h2>
              <button
                type="button"
                onClick={() => setSelectedOrderId(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[#2C2C2C] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Order ID</p>
                <p className="text-[#2C2C2C] font-medium">
                  {selectedOrder._id.slice(-6).toUpperCase()}
                </p>
              </div>

              <div>
                <h3 className="text-base text-[#2C2C2C] mb-3">
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="text-[#2C2C2C] font-medium">Name:</span>{" "}
                    {selectedOrder.user?.name || "Unknown"}
                  </p>
                  <p className="text-gray-600">
                    <span className="text-[#2C2C2C] font-medium">Email:</span>{" "}
                    {selectedOrder.user?.email || "No email"}
                  </p>
                  {selectedOrder.deliveryAddress?.address && (
                    <p className="text-gray-600">
                      <span className="text-[#2C2C2C] font-medium">
                        Delivery Address:
                      </span>{" "}
                      {selectedOrder.deliveryAddress.address},{" "}
                      {selectedOrder.deliveryAddress.city}
                      {selectedOrder.deliveryAddress.state
                        ? `, ${selectedOrder.deliveryAddress.state}`
                        : ""}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base text-[#2C2C2C] mb-3">Order Items</h3>
                {selectedOrder.orderItems?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedOrder.orderItems.map((item, index) => (
                      <div
                        key={`${item.food || "item"}-${index}`}
                        className="text-gray-600"
                      >
                        <p>{item.food?.name || "Food item"} x{item.qty}</p>
                        <p className="text-xs text-gray-500">
                          Prep time: {item.food?.preparationTime || item.preparationTime || 15} minutes
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No order items found.</p>
                )}
              </div>

              <div>
                <h3 className="text-base text-[#2C2C2C] mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="text-[#2C2C2C] font-medium">Date:</span>{" "}
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="text-[#2C2C2C] font-medium">Status:</span>{" "}
                    {selectedOrder.status}
                  </p>
                  <p className="text-gray-600">
                    <span className="text-[#2C2C2C] font-medium">
                      Estimated Window:
                    </span>{" "}
                    {selectedOrderWindow}
                  </p>
                  <p className="text-gray-600">
                    <span className="text-[#2C2C2C] font-medium">Payment:</span>{" "}
                    {selectedOrder.isPaid ? "Paid" : "Not Paid"}
                  </p>
                  <p className="text-gray-600">
                    <span className="text-[#2C2C2C] font-medium">Total:</span>{" "}
                    {formatCurrency(selectedOrder.totalPrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminOrder;
