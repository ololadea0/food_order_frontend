import React from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  Hourglass,
  CircleCheckBig,
  CircleX,
} from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

function OrderItem({ order, onCancel, onTrackOrder }) {
  const date = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : "No date";

  const time = order?.createdAt
    ? new Date(order.createdAt).toLocaleTimeString()
    : "No time";

  const statusIcon = {
    pending: <Package className="h-5 w-5 text-[#FF6B35]" />,
    onTheWay: <Truck className="h-5 w-5 text-[#FF6B35]" />,
    availableForPickup: <CheckCircle2 className="h-5 w-5 text-[#2ED573]" />,
    preparing: <Hourglass className="h-5 w-5 text-[#FFA500]" />,
    delivered: <CircleCheckBig className="h-5 w-5 text-[#2ED573]" />,
    cancelled: <CircleX className="h-5 w-5 text-[#EF4444]" />,
  };

  const statusTextColor = {
    pending: "text-[#FF6B35]",
    onTheWay: "text-[#FF6B35]",
    availableForPickup: "text-[#2ED573]",
    preparing: "text-[#FFA500]",
    delivered: "text-[#2ED573]",
    cancelled: "text-[#EF4444]",
  };

  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-5 w-5 text-[#FF6B35]" />
            <h3 className="text-lg text-[#2C2C2C]">Order #{order?._id}</h3>
          </div>
          <p className="text-sm text-gray-600">{date}</p>
          <span className="text-xs text-gray-600">{time}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full">
          {statusIcon[order?.status]}
          <span className={`text-sm ${statusTextColor[order?.status]}`}>
            {order?.status}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {order?.orderItems?.length} Item(s)
        </div>
        <div className="text-lg text-[#2C2C2C]">
          {formatCurrency(order?.totalPrice)}
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          className="flex-1 py-2 border border-[#FF6B35] text-[#FF6B35] rounded-lg hover:bg-[#FF6B35] hover:text-white transition-colors"
          onClick={() => onTrackOrder(order?._id)}
        >
          Track Order
        </button>
        {(order?.status === "pending" || order?.status === "preparing") &&
          !order.isPaid && (
            <button
              type="button"
              className="flex-1 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
              onClick={() => onCancel(order?._id)}
            >
              Cancel Order
            </button>
          )}
      </div>
    </>
  );
}

export default OrderItem;
