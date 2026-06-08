import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import Spinner from "../components/Spinner";
import { reset, updatePassword } from "../slice/authSlice";

function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    if (isError && message) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess && message) {
      toast.success(message);
      dispatch(reset());
      navigate("/profile", { replace: true });
    }
  }, [dispatch, isError, isSuccess, message, navigate]);

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password must match");
      return;
    }

    dispatch(
      updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }),
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-3xl text-[#2C2C2C] mb-6">Change Password</h2>
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-5"
      >
        <div>
          <label className="text-sm text-gray-600 flex items-center gap-2 mb-2">
            <Lock size={16} /> Current Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={onChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:ring-2 focus:border-transparent focus:outline-none"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600 flex items-center gap-2 mb-2">
            <KeyRound size={16} /> New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={onChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:ring-2 focus:border-transparent focus:outline-none"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-2 block">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onChange}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#FF6B35] focus:ring-2 focus:border-transparent focus:outline-none"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-[#FF6B35] text-white py-3 rounded-lg hover:bg-[#ff5722] transition"
        >
          Update Password
        </button>
      </form>
    </main>
  );
}

export default ChangePassword;
