import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CartItem from "../components/cartItem";
import { formatCurrency } from "../utils/formatCurrency";

function Cart() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems = [] } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [user, navigate, location.pathname]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const deliveryFee = 1000;
  const total = subtotal + deliveryFee;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {cartItems.length === 0 ? (
        <div className="text-center">
          <h2 className="text-3xl text-[#2C2C2C] mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Add some delicious food items to get started!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF5722] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-[#FF6B35] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
          <h2 className="text-3xl text-[#2C2C2C] mb-6">Your Cart</h2>
          <div className="bg-[#F9F9F9] rounded-lg p-6 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl text-[#2C2C2C] mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between text-lg font-bold text-[#2C2C2C]">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="block w-full text-center px-4 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#FF5722] transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default Cart;
