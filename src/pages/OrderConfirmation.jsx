import React, { useEffect } from "react";
import { CircleCheckBig, Package, House } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderbyId } from "../slice/orderSlice";
import Spinner from "../components/Spinner";
import { getEstimatedOrderWindow } from "../utils/orderTiming";

function OrderConfirmation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { order, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(getOrderbyId(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return <Spinner />;
  }

  const deliveryTime = getEstimatedOrderWindow(
    order?.orderItems,
    order?.orderType,
  );

  return (
    <>
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4 flex justify-center ">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CircleCheckBig className="w-12 h-12 text-green-500" />
            </div>
          </div>
          <h2 className="text-3xl text-[#2c2c2c] mb-3">Order Confirmed</h2>
          <p className="text-gray-600 mb-8">
            Thank you for your order, your food is being prepared and will be
            delivered soon
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Package className="h-5 w-5 text-[#ff6b35]" />
              <span>Order Number</span>
            </div>
            <p className="text-2xl text-[#ff6b35]"> #{order?._id}</p>
          </div>
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Status</span>
              <span className="text-[#ff6b35] capitalize">{order?.status}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">
                {order?.orderType === "delivery"
                  ? "Estimated Delivery"
                  : "Estimated Pickup Time"}
              </span>
              <span className="text-[#ff6b35]">{deliveryTime}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              className="flex-1 py-3 border-2 border-[#ff6b35] text-[#ff6b35] rounded-lg hover:bg-[#ff6b35] hover:text-white transition-colors"
              onClick={() => navigate(`/orders/${order?._id}`)}
            >
              Track Order
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-[#ff6b35] text-white py-3 rounded-lg hover:bg-[#ff5722]  transition-colors"
              onClick={() => navigate("/")}
            >
              <House className="h-5 w-5" />
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default OrderConfirmation;
