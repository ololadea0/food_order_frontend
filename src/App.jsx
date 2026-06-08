import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import FoodPage from "./pages/FoodPage";
import OrderReview from "./pages/OrderReview";
import PaymentSuccess from "./pages/PaymentSuccess";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFood from "./pages/AdminFood";
import AdminOrder from "./pages/AdminOrder";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AppContent() {
  const location = useLocation();
  const hiddenHeaderPaths = [
    "/login",
    "/register",
    "/payment-success",
    "/admin",
  ];
  const showHeader = !hiddenHeaderPaths.some((path) =>
    location.pathname.startsWith(path),
  );
  return (
    <div id="container">
      <div className="tailwind">
        <div id="fig-code-root">
          <div className="min-h-screen bg-gray-50">
            {showHeader && <Header />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/food/:id" element={<FoodPage />} />
              <Route path="/order-review" element={<OrderReview />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route
                path="/order-confirmation/:id"
                element={<OrderConfirmation />}
              />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderTracking />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/foods"
                element={
                  <AdminRoute>
                    <AdminFood />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <AdminOrder />
                  </AdminRoute>
                }
              />
              <Route
                path="*"
                element={<div className="p-8 text-center">Page Not Found</div>}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Router>
        <AppContent />
        <ToastContainer />
      </Router>
    </>
  );
}

export default App;
