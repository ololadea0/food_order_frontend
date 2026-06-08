import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderbyId, cancelOrder } from "../slice/orderSlice";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  Hourglass,
  CircleCheckBig,
  CircleX,
} from "lucide-react";
import Spinner from "../components/Spinner";
import { formatCurrency } from "../utils/formatCurrency";
import { getEstimatedOrderWindow } from "../utils/orderTiming";

function OrderTracking() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { order, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(getOrderbyId(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!order) {
    return <p className="text-center py-8">Order not found</p>;
  }

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : "No date";
  const time = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString()
    : "No time";
  const deliveryTime = getEstimatedOrderWindow(
    order.orderItems,
    order.orderType,
  );
  const subtotal = order.orderItems.reduce(
    (acc, item) => acc + (item.price ?? item.food?.price ?? 0) * item.qty,
    0,
  );

  const statusIcon = {
    pending: <Package className="h-5 w-5 text-[#FF6B35]" />,
    onTheWay: <Truck className="h-5 w-5 text-[#FF6B35]" />,
    availableForPickup: <CheckCircle2 className="h-5 w-5 text-[#2ED573]" />,
    preparing: <Hourglass className="h-5 w-5 text-[#FFA500]" />,
    delivered: <CircleCheckBig className="h-5 w-5 text-[#2ED573]" />,
    cancelled: <CircleX className="h-5 w-5 text-[#FF6B35]" />,
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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/orders"
        className="flex items-center gap-2 text-[#2c2c2c] hover:text-[#ff6b35] mb-6"
      >
        <ArrowLeft className="h-5 w-5" /> Back to Orders
      </Link>
      <div className="p-6 bg-[#ff6b35] text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl mb-1">Order #{order._id.slice(-6)}</h1>
            <p className="text-orange-100">
              Placed on {date} at {time}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-200 rounded-lg">
            {statusIcon[order.status]}
            <span className={`text-sm ${statusTextColor[order.status]}`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg text-[#2C2C2C] mb-4">Delivery Information</h2>
        {order.orderType === "delivery" ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#FF6B35] mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Delivery Address</p>
                <p className="text-[#2C2C2C]">
                  {order.deliveryAddress?.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-[#FF6B35] mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="text-[#2C2C2C]">{deliveryTime}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Pickup at restaurant. {deliveryTime}</p>
        )}
      </div>

      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg text-[#2C2C2C] mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div className="flex justify-between items-center" key={item._id}>
              <div>
                <p className="text-[#2C2C2C]">{item.food?.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                <p className="text-xs text-gray-500">
                  Prep time: {item.food?.preparationTime || item.preparationTime || 15} minutes
                </p>
              </div>
              <p className="text-[#2C2C2C]">
                {formatCurrency((item.price ?? item.food?.price ?? 0) * item.qty)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-lg text-[#2C2C2C] mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span>
              {formatCurrency(order.orderType === "delivery" ? 1000 : 0)}
            </span>
          </div>
          <div className="flex justify-between text-xl text-[#2C2C2C] pt-3 border-t border-gray-200">
            <span>Total</span>
            <span className="text-[#FF6B35]">
              {formatCurrency(order.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 flex gap-4">
        <button
          type="button"
          className="flex-1 px-6 py-3 border border-gray-300 text-[#2C2C2C] rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => navigate("/")}
        >
          Order Again
        </button>
        {(order.status === "pending" || order.status === "preparing") &&
          !order.isPaid && (
            <button
              type="button"
              onClick={() => dispatch(cancelOrder(order._id))}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg"
            >
              Cancel Order
            </button>
          )}
      </div>
    </main>
  );
}

export default OrderTracking;
