import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MapPin, Package, UserRound, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import { saveCheckoutData, reset } from "../slice/orderSlice";
import { formatCurrency } from "../utils/formatCurrency";
import { nigeriaLocations } from "../data/nigeriaLocations";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, message } = useSelector((state) => state.order);

  const [orderType, setOrderType] = useState("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const deliveryFee = orderType === "delivery" ? 1000 : 0;
  const total = subtotal + deliveryFee;
  const selectedStateData = useMemo(
    () =>
      nigeriaLocations.find(
        ({ state }) => state === deliveryAddress.state,
      ) || null,
    [deliveryAddress.state],
  );
  const availableStates = useMemo(
    () => nigeriaLocations.map(({ state }) => state),
    [],
  );
  const availableLgas = selectedStateData?.lgas || [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDeliveryAddress((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { city: "" } : {}),
    }));
  };

  const handleCheckout = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (orderType === "delivery") {
      const { name, phone, address, city, state } = deliveryAddress;
      if (!name || !phone || !address || !city || !state) {
        toast.error("Please complete all delivery fields.");
        return;
      }
    }

    dispatch(
      saveCheckoutData({
        orderItems: cartItems.map((item) => ({
          food: item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          preparationTime: item.preparationTime,
          qty: item.qty,
        })),
        orderType,
        deliveryAddress,
      }),
    );
    navigate("/order-review");
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!isLoading && cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems, isLoading, navigate]);

  if (isLoading) return <Spinner />;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to="/cart"
          className="flex items-center gap-2 text-gray-600 hover:text-[#ff6b35] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Cart
        </Link>
      </div>
      <h2 className="text-3xl text-[#2C2C2C] mb-8">Checkout</h2>
      <form className="grid lg:grid-cols-3 gap-8" onSubmit={handleCheckout}>
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl text-[#2C2C2C] mb-4">Order Method</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`p-4 border-2 rounded-lg transition-all ${
                  orderType === "delivery"
                    ? "border-[#FF6B35] bg-orange-50"
                    : "border-gray-300"
                }`}
                onClick={() => setOrderType("delivery")}
              >
                <MapPin className="h-6 w-6 mx-auto mb-2 text-[#FF6B35]" />
                <div className="text-center">
                  <p>Delivery</p>
                  <p className="text-[#2C2C2C]">{formatCurrency(1000)}</p>
                </div>
              </button>
              <button
                type="button"
                className={`p-4 border-2 rounded-lg transition-all ${
                  orderType === "pickup"
                    ? "border-[#FF6B35] bg-orange-50"
                    : "border-gray-300"
                }`}
                onClick={() => setOrderType("pickup")}
              >
                <Package className="h-6 w-6 mx-auto mb-2 text-[#FF6B35]" />
                <div className="text-center">
                  <p>Pickup</p>
                  <p className="text-[#2C2C2C]">Free</p>
                </div>
              </button>
            </div>
          </div>

          {orderType === "delivery" ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <UserRound className="h-6 w-6 font-bold text-[#FF6B35]" />
                <h3>Delivery Information</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={deliveryAddress.name}
                      onChange={handleChange}
                      required
                      placeholder="Your Name"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:ring-2 focus:border-transparent focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={deliveryAddress.phone}
                      onChange={handleChange}
                      required
                      placeholder="Your Phone Number"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={deliveryAddress.address}
                    onChange={handleChange}
                    required
                    placeholder="Your Address"
                    className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    State
                  </label>
                  <select
                    name="state"
                    value={deliveryAddress.state}
                    onChange={handleChange}
                    required
                    className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent focus:outline-none"
                  >
                    <option value="">Select a state</option>
                    {availableStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    LGA
                  </label>
                  <select
                    name="city"
                    value={deliveryAddress.city}
                    onChange={handleChange}
                    required
                    disabled={!deliveryAddress.state}
                    className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent focus:outline-none"
                  >
                    <option value="">
                      {deliveryAddress.state
                        ? "Select an LGA"
                        : "Select a state first"}
                    </option>
                    {availableLgas.map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-6 w-6 text-[#FF6B35]" />
                <h3 className="text-xl text-[#2c2c2c]">Contact Information</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={deliveryAddress.name}
                      onChange={handleChange}
                      required
                      placeholder="Your Name"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={deliveryAddress.phone}
                      onChange={handleChange}
                      required
                      placeholder="Your Phone Number"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4">
                <p className="text-sm text-gray-700">
                  <strong>Pickup Location: </strong>
                  ChopStack Restaurant
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  No 2, General Gas, Off Ilorin-Ogbomosho Expressway, Ilorin,
                  Nigeria
                </p>
                <p className="text-sm text-gray-700">
                  You'll receive a notification once your order is ready.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-xl text-[#2c2c2c] mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>
                    {item.name} x {item.qty}
                  </span>
                  <span>{formatCurrency(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>
                  {orderType === "delivery" ? "Delivery Fee" : "Pickup Fee"}
                </span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-[#2c2c2c] pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-semibold hover:bg-[#FF5722] transition-colors"
            >
              Review Order
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default Checkout;
