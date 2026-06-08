import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyPayment, reset as resetPayment } from "../slice/paymentSlice";
import { reset as resetOrder } from "../slice/orderSlice";
import { clearCart } from "../slice/cartSlice";

function PaymentSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reference = searchParams.get("reference");

  useEffect(() => {
    const verify = async () => {
      if (!reference) return;

      try {
        const result = await dispatch(verifyPayment(reference)).unwrap();
        const orderId = result?.orderId;

        if (orderId) {
          dispatch(clearCart());
          dispatch(resetPayment());
          dispatch(resetOrder());
          navigate(`/order-confirmation/${orderId}`);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Verification failed:", error);
        navigate("/");
      }
    };

    verify();
  }, [reference, dispatch, navigate]);

  return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-semibold">Verifying payment...</h2>
      <p>Please wait, this won't take long.</p>
    </div>
  );
}

export default PaymentSuccess;
