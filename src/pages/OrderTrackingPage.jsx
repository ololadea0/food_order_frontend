import { useApp } from "../context/AppContext";
import { useDispatch } from "react-redux";
import { createCommentThunk } from "../store/orderSlice";
import { formatCurrency } from "../lib/formatters";
import Navbar from "../components/Navbar";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderTimeline from "../components/OrderTimeline";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderNotFound({ navigate }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar currentPage="orders" navigate={navigate} />
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="font-semibold text-stone-900">Order not found.</p>
        <button
          onClick={() => navigate("orders")}
          className="text-orange-600 text-sm font-medium hover:underline"
        >
          Back to orders
        </button>
      </div>
    </div>
  );
}

function BackToOrdersButton({ navigate }) {
  return (
    <button
      onClick={() => navigate("orders")}
      className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors mb-6"
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
  );
}

function OrderHeader({ order }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-4">
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <h1
            className="text-lg font-semibold text-stone-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Order #{order.id}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
    </div>
  );
}

function ProgressPanel({ order }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <h2 className="text-sm font-semibold text-stone-900 mb-5">
        Order progress
      </h2>
      <OrderTimeline currentStatus={order.status} />
      {order.status !== "Delivered" && order.status !== "Cancelled" && (
        <div className="mt-4 p-3 bg-stone-50 rounded-xl text-xs text-stone-500">
          <span className="font-medium">Note:</span> Status is updated by the
          restaurant. Refresh to see the latest.
        </div>
      )}
    </div>
  );
}

function ItemsSummary({ order }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <h2 className="text-sm font-semibold text-stone-900 mb-4">
        Items ordered
      </h2>
      <div className="space-y-3">
        {order.items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center gap-3"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-11 h-11 rounded-lg object-cover bg-stone-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">
                {item.name}
              </p>
              <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold text-stone-900 flex-shrink-0">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-100 mt-4 pt-3 space-y-1.5 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Delivery fee</span>
          <span>{formatCurrency(order.deliveryFee)}</span>
        </div>
        <div className="flex justify-between font-bold text-stone-900 pt-1">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  );
}

function DeliveryDetails({ order }) {
  const paymentClass =
    order.paymentStatus === "Paid"
      ? "font-medium text-green-700"
      : order.paymentStatus === "Failed"
        ? "font-medium text-red-600"
        : "font-medium text-amber-700";

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <h2 className="text-sm font-semibold text-stone-900 mb-3">
        Delivery details
      </h2>
      <div className="space-y-2.5 text-sm">
        <div className="flex gap-2">
          <svg
            className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <circle cx="12" cy="11" r="3" />
          </svg>
          <span className="text-stone-700">{order.deliveryAddress}</span>
        </div>

        <div className="flex gap-2">
          <svg
            className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span className="text-stone-700">{order.customer.phone}</span>
        </div>

        <div className="flex gap-2">
          <svg
            className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" strokeLinecap="round" />
          </svg>
          <span className={paymentClass}>Payment: {order.paymentStatus}</span>
        </div>
      </div>
    </div>
  );
}

function CommentsSection({ order, dispatch }) {
  return (
    <div className="mt-6 bg-white rounded-2xl border border-stone-200 p-5">
      <h3 className="text-sm font-semibold mb-3">Comments & feedback</h3>

      {order.comments && order.comments.length > 0 ? (
        order.comments.map((comment, index) => (
          <div key={`${comment.message}-${index}`} className="mb-2 text-sm">
            <div className="font-medium">
              {comment.user?.name || "Customer"}
            </div>
            <div className="text-stone-600">{comment.message}</div>
            <div className="text-xs text-stone-400">
              {new Date(comment.createdAt).toLocaleString()}
            </div>
          </div>
        ))
      ) : (
        <div className="text-sm text-stone-500 mb-3">No comments yet.</div>
      )}

      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const data = new FormData(event.target);
          const message = data.get("message");

          if (!message || !String(message).trim()) return;

          try {
            await dispatch(
              createCommentThunk({ id: order.id, message }),
            ).unwrap();
            event.target.reset();
          } catch (error) {
            console.error("Failed to post comment", error);
          }
        }}
        className="space-y-2"
      >
        <textarea
          name="message"
          placeholder="Describe the issue or leave feedback (e.g. delivery was late)"
          rows={3}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="h-10 px-4 bg-orange-500 text-white rounded-lg text-sm"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default function OrderTrackingPage({ orderId, navigate }) {
  const dispatch = useDispatch();
  const { orders } = useApp();
  const order = orders.find((item) => item.id === orderId);

  if (!order) return <OrderNotFound navigate={navigate} />;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar currentPage="orders" navigate={navigate} />

      <div className="max-w-4xl mx-auto px-6 py-8 w-full flex-1">
        <BackToOrdersButton navigate={navigate} />
        <OrderHeader order={order} />

        <div className="grid md:grid-cols-2 gap-4">
          <ProgressPanel order={order} />

          <div className="space-y-4">
            <ItemsSummary order={order} />
            <DeliveryDetails order={order} />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("menu")}
            className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Order again
          </button>
          <button
            onClick={() => navigate("orders")}
            className="h-11 px-6 border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors"
          >
            All orders
          </button>
        </div>

        <CommentsSection order={order} dispatch={dispatch} />
      </div>
    </div>
  );
}
