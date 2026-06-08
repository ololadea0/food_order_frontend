import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { registerUser, reset } from "../slice/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { email, password, password2 } = formData;
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate("/");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Passwords do not match");
      return;
    }
    const userData = {
      name: formData.name,
      email,
      password,
    };
    dispatch(registerUser(userData));
  };
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div id="fig-code-root" style={{ height: "100%" }}>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
            <Link to="/">
              <h1 className="text-4xl text-[#ff6b35] tracking-tight mb-2 text-center">
                ChopStack
              </h1>
            </Link>
            <p className="text-gray-600 text-center mb-8">
              Create your account
            </p>
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="name"
                  id="name"
                  name="name"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#FF3b35] focus:border-transparent"
                  placeholder="Enter your name"
                  required
                  value={formData.name}
                  onChange={onChange}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#FF3b35] focus:border-transparent"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={onChange}
                  autoComplete="email"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#FF3b35] focus:border-transparent"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={onChange}
                    autoComplete="new-password"
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password2"
                    name="password2"
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-[#FF3b35] focus:border-transparent"
                    placeholder="••••••••"
                    required
                    value={password2}
                    onChange={onChange}
                    autoComplete="new-password"
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
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#FF6B35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn size={20} />
                Create Account
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-[#FF6B35] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
            <div className="mt-4 text-center">
              <Link to="/" className="text-gray-600 hover:text-[#ff6b35]">
                <ArrowLeft size={20} className="inline mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
