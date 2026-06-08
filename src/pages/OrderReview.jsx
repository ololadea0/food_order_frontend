import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  UserRound,
  Phone,
  MapPin,
  MapPinHouse,
  CreditCard,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { initializePayment } from "../slice/paymentSlice";
import { createOrder } from "../slice/orderSlice";
import { formatCurrency } from "../utils/formatCurrency";
import { getEstimatedOrderWindow } from "../utils/orderTiming";

function OrderReview() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { checkoutData, order, isLoading, isError, message } = useSelector(
    (state) => state.order,
  );
  const { payment } = useSelector((state) => state.payment);

  useEffect(() => {
    if (order?._id && !order.isPaid) {
      dispatch(initializePayment(order._id));
    }
  }, [order, dispatch]);

  useEffect(() => {
    if (payment?.authorizationUrl) {
      window.location.href = payment.authorizationUrl;
    }
  }, [payment]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
    }
  }, [isError, message]);

  if (!checkoutData) {
    return (
      <div className="text-center py-8">
        No checkout data found. Please go back to checkout.
      </div>
    );
  }

  const subtotal =
    checkoutData.orderItems?.reduce(
      (acc, item) => acc + item.price * item.qty,
      0,
    ) || 0;
  const deliveryFee = checkoutData.orderType === "delivery" ? 1000 : 0;
  const total = subtotal + deliveryFee;
  const estimatedWindow = getEstimatedOrderWindow(
    checkoutData.orderItems,
    checkoutData.orderType,
  );

  const handleProceedToPayment = () => {
    if (!order?._id) {
      dispatch(createOrder(checkoutData));
      return;
    }

    dispatch(initializePayment(order._id));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to="/cart"
          className="flex items-center gap-2 text-gray-600 hover:text-[#ff6b35] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Cart
        </Link>
      </div>
      <h2 className="text-3xl text-[#2C2C2C] mb-6">Review Your Order</h2>
      <p className="text-gray-600 mb-6">
        Please review your order before proceeding to payment.
      </p>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5" />
              <h3 className="text-xl text-[#2C2C2C]">Order Items</h3>
            </div>
            <div className="space-y-4">
              {checkoutData.orderItems.map((item) => (
                <div
                  className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0"
                  key={item.food || item.name}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-[#2c2c2c]">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.qty}
                    </p>
                    <p className="text-xs text-gray-500">
                      Prep time: {item.preparationTime || 15} minutes
                    </p>
                  </div>
                  <p className="text-[#2c2c2c]">
                    {formatCurrency(item.price * item.qty)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5" />
              <h3 className="text-xl text-[#2C2C2C]">Customer Information</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-sm text-[#2C2C2C]">
                    {checkoutData.deliveryAddress?.name || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="text-sm text-[#2C2C2C]">
                    {checkoutData.deliveryAddress?.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-[#ff6b35]" />
              <h3 className="text-xl text-[#2C2C2C]">
                {checkoutData.orderType === "pickup"
                  ? "Pickup Information"
                  : "Delivery Information"}
              </h3>
            </div>
            {checkoutData.orderType === "pickup" ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Pickup Address:</strong> ChopStack Restaurant
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  No 2, General Gas, Off Ilorin-Ogbomosho Expressway, Ilorin,
                  Nigeria
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPinHouse className="h-5 w-5" />
                  <div>
                    <p className="text-xs text-gray-500">Delivery Address</p>
                    <p className="text-sm text-[#2C2C2C]">
                      {checkoutData.deliveryAddress?.address || "Not provided"}
                    </p>
                    <p className="text-sm text-[#2C2C2C]">
                      {checkoutData.deliveryAddress?.city || "Not provided"}
                    </p>
                    <p className="text-sm text-[#2C2C2C]">
                      {checkoutData.deliveryAddress?.state || "Not provided"}{" "}
                      State
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="text-xl text-[#2C2C2C] mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {checkoutData.orderItems.map((item) => (
                <div
                  key={item._id || item.food}
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
                  <span>Estimated Time</span>
                  <span>{estimatedWindow}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>
                  {checkoutData.orderType === "pickup"
                    ? "Pickup Fee"
                    : "Delivery Fee"}
                </span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-[#2c2c2c] pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-[#ff6b35]">{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                By clicking "Proceed to Payment", you'll be redirected to our
                secure payment gateway to complete your order.
              </p>
            </div>
            <button
              type="button"
              onClick={handleProceedToPayment}
              className="w-full py-3 bg-[#ff6b35] text-white rounded-lg hover:bg-[#ff5722] transition-colors flex justify-center items-center gap-2 duration-300 mb-3"
            >
              <CreditCard className="h-5 w-5" />
              Proceed to Payment
            </button>
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Edit Order
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderReview;
