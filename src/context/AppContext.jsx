import { jsx as _jsx } from "react/jsx-runtime";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/authSlice";
import { fetchFoods } from "../store/foodSlice";
import {
  createOrderThunk,
  fetchAllOrders,
  fetchUserOrders,
  updateOrderStatusThunk,
  cancelOrderThunk,
} from "../store/orderSlice";
import { formatDeliveryAddress, getFoodImage } from "../lib/formatters";

const AppContext = createContext(null);

const normalizeStatus = (status) => {
  const value = (status || "pending").toString().trim();
  const map = {
    pending: "Pending",
    ontheway: "Out for Delivery",
    availableforpickup: "Available for Pickup",
    preparing: "Preparing",
    delivered: "Delivered",
    cancelled: "Cancelled",
    confirmed: "Confirmed",
  };
  return (
    map[value.toLowerCase()] || value.charAt(0).toUpperCase() + value.slice(1)
  );
};

const serializeStatus = (status) => {
  const map = {
    Pending: "pending",
    Confirmed: "confirmed",
    Preparing: "preparing",
    "Out for Delivery": "onTheWay",
    "Available for Pickup": "availableForPickup",
    Delivered: "delivered",
    Cancelled: "cancelled",
  };
  return map[status] || status;
};

const normalizeOrder = (order = {}) => {
  const id = order._id || order.id;
  const status = normalizeStatus(order.status);
  const total = Number(order.totalPrice ?? order.total ?? 0);
  const orderItems = Array.isArray(order.orderItems)
    ? order.orderItems
    : Array.isArray(order.items)
      ? order.items
      : [];
  const rawDeliveryAddress =
    order.deliveryAddress ||
    order.deliveryAddressDetails ||
    order.user?.deliveryAddress ||
    order.customer?.deliveryAddress ||
    {};
  const customerPhone =
    order.user?.phone ||
    order.user?.deliveryAddress?.phone ||
    order.customer?.phone ||
    order.customer?.deliveryAddress?.phone ||
    rawDeliveryAddress.phone ||
    "";
  const customer =
    order.user && typeof order.user === "object"
      ? {
          name: order.user.name || "Customer",
          email: order.user.email || "",
          phone: customerPhone,
        }
      : {
          name: order.customer?.name || "Customer",
          email: order.customer?.email || "",
          phone: customerPhone,
        };

  return {
    ...order,
    id,
    status,
    total,
    subtotal: Number(
      order.subtotal ?? Math.max(0, total - Number(order.deliveryFee ?? 0)),
    ),
    deliveryFee: Number(order.deliveryFee ?? 0),
    paymentStatus: order.isPaid ? "Paid" : "Pending",
    deliveryAddress: formatDeliveryAddress(rawDeliveryAddress),
    deliveryAddressDetails: rawDeliveryAddress,
    customer,
    items: orderItems.map((item) => {
      const food = item.food || {};
      const foodId = food._id || food.id || item.foodId || item.id;
      const hasFoodImage = Boolean(food.image || food.imageUrl);
      return {
        ...item,
        id: foodId,
        name: food.name || item.name || "Menu item",
        imageUrl: hasFoodImage
          ? getFoodImage(food, "w=120&h=120")
          : item.imageUrl || null,
        price: Number(item.price ?? food.price ?? item.totalPrice ?? 0),
        quantity: item.qty ?? item.quantity ?? 1,
      };
    }),
  };
};

export function AppProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const foodStatus = useSelector((state) => state.food.status);
  const rawOrders = useSelector((state) => state.orders.items || []);
  const orders = useMemo(() => rawOrders.map(normalizeOrder), [rawOrders]);
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      // ignore
    }
  }, [cart]);
  const [favorites, setFavorites] = useState([]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cart.reduce(
    (s, i) => s + Number(i.food.price || 0) * i.quantity,
    0,
  );

  useEffect(() => {
    if (foodStatus === "idle") dispatch(fetchFoods());
  }, [dispatch, foodStatus]);

  useEffect(() => {
    if (!user) return;
    const role = user.role?.toLowerCase?.();
    if (role === "admin") {
      dispatch(fetchAllOrders());
      dispatch(fetchUsers());
      return;
    }
    dispatch(fetchUserOrders());
  }, [dispatch, user]);

  const addToCart = useCallback((food, qty = 1) => {
    const itemId = food._id || food.id;
    setCart((prev) => {
      const existing = prev.find((i) => (i.food._id || i.food.id) === itemId);
      if (existing) {
        return prev.map((i) =>
          (i.food._id || i.food.id) === itemId
            ? { ...i, quantity: i.quantity + qty }
            : i,
        );
      }
      return [...prev, { food, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((foodId) => {
    setCart((prev) => prev.filter((i) => (i.food._id || i.food.id) !== foodId));
  }, []);

  const updateCartQty = useCallback((foodId, qty) => {
    if (qty <= 0) {
      setCart((prev) =>
        prev.filter((i) => (i.food._id || i.food.id) !== foodId),
      );
    } else {
      setCart((prev) =>
        prev.map((i) =>
          (i.food._id || i.food.id) === foodId ? { ...i, quantity: qty } : i,
        ),
      );
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((foodId) => {
    setFavorites((prev) =>
      prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [...prev, foodId],
    );
  }, []);

  const placeOrder = useCallback(
    async (
      deliveryDetails,
      orderType = "delivery",
      options = { clearCart: true },
    ) => {
      if (!cart.length) return null;

      const payload = {
        orderType,
        orderItems: cart.map(({ food, quantity }) => ({
          food: food._id || food.id,
          qty: quantity,
        })),
        deliveryAddress: orderType === "delivery" ? deliveryDetails : undefined,
      };

      const result = await dispatch(createOrderThunk(payload)).unwrap();
      if (options?.clearCart !== false) clearCart();
      return normalizeOrder(result);
    },
    [cart, clearCart, dispatch],
  );

  const updateOrderStatus = useCallback(
    async (orderId, nextStatus) => {
      return dispatch(
        updateOrderStatusThunk({
          id: orderId,
          status: serializeStatus(nextStatus),
        }),
      ).unwrap();
    },
    [dispatch],
  );

  const cancelOrder = useCallback(
    async (orderId) => {
      return dispatch(cancelOrderThunk(orderId)).unwrap();
    },
    [dispatch],
  );

  return _jsx(AppContext.Provider, {
    value: {
      cart,
      favorites,
      user,
      orders,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      toggleFavorite,
      placeOrder,
      updateOrderStatus,
      cancelOrder,
    },
    children: children,
  });
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return ctx;
}
