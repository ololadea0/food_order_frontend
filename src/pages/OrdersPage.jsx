import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

import { formatCurrency } from "../lib/formatters";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import OrderStatusBadge from "../components/OrderStatusBadge";
import Footer from "../components/Footer";
const STATUS_FILTERS = [
  "All",
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
export default function OrdersPage({ navigate }) {
  const { orders, cancelOrder } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const filtered =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return _jsxs("div", {
    className: "min-h-screen bg-stone-50 flex flex-col",
    children: [
      _jsx(Navbar, { currentPage: "orders", navigate: navigate }),
      _jsxs("div", {
        className: "max-w-4xl mx-auto px-6 py-8 w-full flex-1",
        children: [
          _jsxs("div", {
            className: "flex items-center justify-between mb-6",
            children: [
              _jsx("h1", {
                className: "text-2xl font-semibold text-stone-900",
                style: { fontFamily: "var(--font-display)" },
                children: "My orders",
              }),
              _jsxs("span", {
                className: "text-sm text-stone-500",
                children: [
                  filtered.length,
                  " order",
                  filtered.length !== 1 ? "s" : "",
                ],
              }),
            ],
          }),
          _jsx("div", {
            className: "flex gap-2 overflow-x-auto pb-2 mb-6",
            children: STATUS_FILTERS.map((s) => {
              const count =
                s === "All"
                  ? orders.length
                  : orders.filter((o) => o.status === s).length;
              if (count === 0 && s !== "All") return null;
              return _jsxs(
                "button",
                {
                  onClick: () => setFilter(s),
                  className: `flex-shrink-0 h-8 px-3.5 rounded-full text-xs font-semibold border transition-all ${
                    filter === s
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-600"
                  }`,
                  children: [
                    s,
                    " ",
                    count > 0 &&
                      _jsxs("span", {
                        className: "opacity-70",
                        children: ["(", count, ")"],
                      }),
                  ],
                },
                s,
              );
            }),
          }),
          sorted.length === 0
            ? _jsxs("div", {
                className: "text-center py-24 flex flex-col items-center",
                children: [
                  _jsx("div", {
                    className:
                      "w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4",
                    children: _jsx("svg", {
                      className: "w-8 h-8 text-stone-400",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      strokeWidth: "1.5",
                      children: _jsx("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                      }),
                    }),
                  }),
                  _jsx("p", {
                    className: "font-semibold text-stone-900 mb-1",
                    children:
                      filter === "All"
                        ? "You haven't placed an order yet."
                        : `No ${filter.toLowerCase()} orders.`,
                  }),
                  _jsx("p", {
                    className: "text-stone-500 text-sm mb-5",
                    children: "Browse our menu and place your first order.",
                  }),
                  _jsx("button", {
                    onClick: () => navigate("menu"),
                    className:
                      "h-10 px-5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600",
                    children: "Browse Menu",
                  }),
                ],
              })
            : _jsx("div", {
                className: "space-y-3",
                children: sorted.map((order) =>
                  _jsxs(
                    "div",
                    {
                      className:
                        "bg-white rounded-2xl border border-stone-200 p-5 hover:border-stone-300 transition-colors",
                      children: [
                        _jsxs("div", {
                          className:
                            "flex items-start justify-between gap-3 mb-3",
                          children: [
                            _jsxs("div", {
                              children: [
                                _jsxs("div", {
                                  className: "flex items-center gap-2 mb-0.5",
                                  children: [
                                    _jsxs("span", {
                                      className:
                                        "font-mono text-xs text-stone-500",
                                      children: ["#", order.id],
                                    }),
                                    _jsx(OrderStatusBadge, {
                                      status: order.status,
                                    }),
                                  ],
                                }),
                                _jsxs("p", {
                                  className: "text-xs text-stone-400",
                                  children: [
                                    formatDate(order.createdAt),
                                    " at ",
                                    formatTime(order.createdAt),
                                  ],
                                }),
                              ],
                            }),
                            _jsxs("span", {
                              className:
                                "font-bold text-stone-900 text-base flex-shrink-0",
                              children: [formatCurrency(order.total)],
                            }),
                          ],
                        }),
                        _jsxs("div", {
                          className: "flex items-center gap-2 mb-3",
                          children: [
                            _jsxs("div", {
                              className: "flex -space-x-2",
                              children: [
                                order.items.slice(0, 3).map((item, i) =>
                                  _jsx(
                                    "img",
                                    {
                                      src: item.imageUrl,
                                      alt: item.name,
                                      className:
                                        "w-9 h-9 rounded-lg object-cover bg-stone-100 border-2 border-white flex-shrink-0",
                                    },
                                    i,
                                  ),
                                ),
                                order.items.length > 3 &&
                                  _jsxs("div", {
                                    className:
                                      "w-9 h-9 rounded-lg bg-stone-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-stone-500",
                                    children: ["+", order.items.length - 3],
                                  }),
                              ],
                            }),
                            _jsx("p", {
                              className: "text-sm text-stone-600 truncate",
                              children: order.items
                                .map((i) => `${i.name} ×${i.quantity}`)
                                .join(", "),
                            }),
                          ],
                        }),
                        _jsxs("div", {
                          className:
                            "flex items-center justify-between border-t border-stone-100 pt-3",
                          children: [
                            _jsxs("span", {
                              className: `text-xs font-medium ${order.paymentStatus === "Paid" ? "text-green-600" : order.paymentStatus === "Failed" ? "text-red-600" : "text-amber-600"}`,
                              children: [
                                order.paymentStatus === "Paid" ? "✓ " : "",
                                order.paymentStatus,
                              ],
                            }),
                            _jsxs("div", {
                              className: "flex gap-2",
                              children: [
                                (order.status === "Pending" ||
                                  order.status === "Preparing") &&
                                order.paymentStatus !== "Paid"
                                  ? _jsx(
                                      "button",
                                      {
                                        onClick: () => {
                                          setConfirmTarget(order.id);
                                          setConfirmOpen(true);
                                        },
                                        className:
                                          "text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all",
                                        children: "Cancel",
                                      },
                                      "cancel-" + order.id,
                                    )
                                  : null,
                                order.status === "Pending" ||
                                order.status === "Confirmed" ||
                                order.status === "Preparing" ||
                                order.status === "Out for Delivery"
                                  ? _jsx(
                                      "button",
                                      {
                                        onClick: () =>
                                          navigate("order-tracking", {
                                            orderId: order.id,
                                          }),
                                        className:
                                          "text-xs font-semibold text-orange-600 hover:text-orange-700 border border-orange-200 hover:border-orange-400 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-all",
                                        children: "Track order",
                                      },
                                      "track-" + order.id,
                                    )
                                  : null,
                                _jsx(
                                  "button",
                                  {
                                    onClick: () =>
                                      navigate("order-tracking", {
                                        orderId: order.id,
                                      }),
                                    className:
                                      "text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 px-3 py-1.5 rounded-lg transition-all",
                                    children: "View details",
                                  },
                                  "view-" + order.id,
                                ),
                              ],
                            }),
                          ],
                        }),
                      ],
                    },
                    order.id,
                  ),
                ),
              }),
        ],
      }),
      _jsx(ConfirmModal, {
        open: confirmOpen,
        title: "Cancel order",
        message:
          "Are you sure you want to cancel this order? This cannot be undone.",
        loading: confirmLoading,
        confirmLabel: "Cancel order",
        onCancel: () => setConfirmOpen(false),
        onConfirm: async () => {
          setConfirmLoading(true);
          try {
            await cancelOrder(confirmTarget);
          } catch (err) {
            alert(err || "Unable to cancel order");
          } finally {
            setConfirmLoading(false);
            setConfirmOpen(false);
          }
        },
      }),
      _jsx(Footer, { navigate: navigate }),
    ],
  });
}
