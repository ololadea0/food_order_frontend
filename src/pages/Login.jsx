import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, reset } from "../slice/authSlice";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Eye, EyeOff, LogIn } from "lucide-react";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess && user) {
      navigate(from || "/", { replace: true });
      dispatch(reset());
    }
  }, [isError, isSuccess, message, navigate, dispatch, from, user]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };
    await dispatch(loginUser(userData));
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
              Welcome to ChopStack! Sign in to your account.
            </p>
            <form className="space-y-6" onSubmit={onSubmit}>
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
                    autoComplete="current-password"
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
                Sign In
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#FF6B35] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
            <div className="mt-4 text-center">
              <Link to="/" className="text-gray-600 hover:text-[#ff6b35]">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
