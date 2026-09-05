import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import ConfirmModal from "./ConfirmModal";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency } from "../lib/formatters";

export default function AdminOrderDetail({
  selectedOrder,
  setView,
  newStatus,
  setNewStatus,
  handleUpdateStatus,
  updateSuccess,
  updating,
  STATUS_OPTIONS,
  NEXT_STATUS,
  formatDate,
}) {
  if (!selectedOrder) return <p className="text-stone-500">Order not found.</p>;

  const { updateOrderStatus } = useApp();
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const customerPhone =
    selectedOrder.customer?.phone ||
    selectedOrder.user?.phone ||
    selectedOrder.user?.deliveryAddress?.phone ||
    selectedOrder.deliveryAddressDetails?.phone ||
    selectedOrder.deliveryAddress?.phone ||
    "—";
  return (
    <div className="space-y-4">
      <button
        onClick={() => setView("list")}
        className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="19" y1="12" x2="5" y2="12" strokeLinecap="round" />
          <polyline
            points="12 19 5 12 12 5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to orders
      </button>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-mono text-xs text-stone-500 mb-1">
                  #{selectedOrder.id}
                </p>
                <h2
                  className="font-semibold text-stone-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Order Details
                </h2>
              </div>
              <OrderStatusBadge status={selectedOrder.status} />
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Customer</span>
                <span className="font-medium text-stone-900">
                  {selectedOrder.customer.name}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Email</span>
                <span className="font-medium text-stone-900">
                  {selectedOrder.customer.email}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Phone</span>
                <span className="font-medium text-stone-900">
                  {customerPhone}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Address</span>
                <span className="font-medium text-stone-900 text-right max-w-[200px]">
                  {selectedOrder.deliveryAddress}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Date</span>
                <span className="font-medium text-stone-900">
                  {formatDate(selectedOrder.createdAt)}
                </span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Payment</span>
                <span
                  className={`font-semibold ${selectedOrder.paymentStatus === "Paid" ? "text-green-600" : selectedOrder.paymentStatus === "Failed" ? "text-red-600" : "text-amber-600"}`}
                >
                  {selectedOrder.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5">
            <h3 className="font-semibold text-stone-900 mb-4">
              Update Order Status
            </h3>
            {updateSuccess && (
              <div className="mb-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Status updated successfully.
              </div>
            )}

            {cancelSuccess && (
              <div className="mb-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Order cancelled successfully.
              </div>
            )}

            {selectedOrder.status !== "Delivered" &&
              selectedOrder.status !== "Cancelled" &&
              NEXT_STATUS[selectedOrder.status] && (
                <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-800">
                  <span className="font-semibold">Suggested next:</span>{" "}
                  {NEXT_STATUS[selectedOrder.status]}
                </div>
              )}

            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full h-10 pl-3 pr-8 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400/30 appearance-none cursor-pointer"
                >
                  <option value="">Select new status…</option>
                  {STATUS_OPTIONS.filter((s) => s !== selectedOrder.status).map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ),
                  )}
                </select>
                <svg
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline
                    points="6 9 12 15 18 9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <button
                onClick={handleUpdateStatus}
                disabled={!newStatus || updating}
                className="h-10 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {updating ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  "Update"
                )}
              </button>
              {selectedOrder.paymentStatus !== "Paid" &&
                selectedOrder.status !== "Cancelled" &&
                selectedOrder.status !== "Delivered" && (
                  <>
                    <button
                      onClick={() => setConfirmOpen(true)}
                      disabled={cancelling}
                      className="h-10 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                      {cancelling ? (
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          ></path>
                        </svg>
                      ) : (
                        "Cancel"
                      )}
                    </button>
                    <ConfirmModal
                      open={confirmOpen}
                      title="Cancel order"
                      message="Are you sure you want to cancel this order? This cannot be undone."
                      loading={cancelling}
                      confirmLabel="Cancel order"
                      onCancel={() => setConfirmOpen(false)}
                      onConfirm={async () => {
                        setCancelling(true);
                        try {
                          await updateOrderStatus(
                            selectedOrder.id,
                            "Cancelled",
                          );
                          setCancelSuccess(true);
                          setTimeout(() => setCancelSuccess(false), 3000);
                        } catch (err) {
                          alert(err || "Unable to cancel order");
                        } finally {
                          setCancelling(false);
                          setConfirmOpen(false);
                        }
                      }}
                    />
                  </>
                )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-900 mb-4">Items</h3>
          <div className="space-y-3 mb-4">
            {selectedOrder.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-11 h-11 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    Qty: {item.quantity} · {formatCurrency(item.price)} each
                  </p>
                </div>
                <span className="text-sm font-semibold text-stone-900 flex-shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-5 mt-4">
            <h3 className="font-semibold text-stone-900 mb-3">
              Customer comments
            </h3>
            {selectedOrder.comments && selectedOrder.comments.length > 0 ? (
              <div className="space-y-3">
                {selectedOrder.comments.map((c, i) => (
                  <div key={i} className="p-3 rounded-lg bg-stone-50">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">
                        {c.user?.name || c.user || "Customer"}
                      </div>
                      <div className="text-xs text-stone-400">
                        {formatDate(c.createdAt)}
                      </div>
                    </div>
                    <div className="text-sm text-stone-700 mt-1">
                      {c.message}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-stone-500">No comments yet.</div>
            )}
          </div>

          <div className="border-t border-stone-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>{formatCurrency(selectedOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery fee</span>
              <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-100">
              <span>Total</span>
              <span>{formatCurrency(selectedOrder.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
