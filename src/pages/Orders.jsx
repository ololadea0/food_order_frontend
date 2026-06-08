import { useEffect } from "react";

import OrderItem from "../components/OrderItem";

import { getMyOrders, cancelOrder } from "../slice/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../components/Spinner";

function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const handleCancel = (orderId) => {
    dispatch(cancelOrder(orderId)).then(() => {
      dispatch(getMyOrders());
    });
  };

  const handleTrackOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders?.length > 0 && (
          <h2 className="text-3xl text-[#2C2C2C] mb-8">Your Orders</h2>
        )}

        {orders?.length === 0 ? (
          <>
            <div className="text-center ">
              <p className="text-gray-600">No orders yet.</p>
              <Link
                to="/"
                className=" text-[#2c2c2c] hover:text-[#ff6b35] mb-6"
              >
                Back to Home
              </Link>
            </div>
          </>
        ) : (
          orders?.map((order) => (
            <div
              key={order?._id}
              className="bg-white rounded-lg shadow-md p-6 mb-4 "
            >
              <OrderItem
                order={order}
                onCancel={handleCancel}
                onTrackOrder={handleTrackOrder}
              />
            </div>
          ))
        )}
      </main>
    </>
  );
}

export default Orders;
