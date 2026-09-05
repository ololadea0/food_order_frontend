import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../store/authSlice";

export default function LoginPage({ onLoginSuccess, onNavigateRegister }) {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const emailRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    if (!email.trim()) {
      emailRef.current?.focus();
      return;
    }

    if (!password) {
      return;
    }

    try {
      const payload = await dispatch(loginUser({ email, password })).unwrap();
      onLoginSuccess(payload);
    } catch {
      // Redux error is displayed below.
    }
  };

  const loading = status === "loading";

  return (
    <div className="min-h-screen flex bg-stone-50">
      <div className="hidden lg:flex lg:w-[45%] relative flex-col overflow-hidden bg-stone-950">
        <img
          src="https://images.unsplash.com/photo-1692197275441-40c874f40385?w=900&h=1200&fit=crop&auto=format"
          alt="Premium restaurant food"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/20" />
        <div className="relative z-10 flex flex-col h-full p-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
                aria-hidden="true"
              >
                <path
                  d="M12 2C8 2 4 5.5 4 10c0 2.5 1.2 4.7 3 6.2V20a1 1 0 001 1h8a1 1 0 001-1v-3.8c1.8-1.5 3-3.7 3-6.2C20 5.5 16 2 12 2z"
                  fill="currentColor"
                  opacity=".9"
                />
                <path
                  d="M9 21v1a1 1 0 001 1h4a1 1 0 001-1v-1H9z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span
              className="text-white text-xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Cravings
            </span>
          </div>

          <div className="flex-1" />

          <div className="space-y-6">
            <blockquote className="space-y-3">
              <p
                className="text-white text-3xl xl:text-4xl font-medium leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Good food,
                <br />
                <em className="text-orange-400 not-italic">delivered fast.</em>
              </p>
              <p className="text-stone-400 text-base leading-relaxed max-w-xs">
                Order from the city's finest restaurants and have it at your
                door in under 30 minutes.
              </p>
            </blockquote>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex flex-col">
                <span className="text-white font-semibold text-base">12k+</span>
                <span className="text-stone-400 text-xs">Happy customers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-base">
                  30 min
                </span>
                <span className="text-stone-400 text-xs">Avg delivery</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-semibold text-base">24/7</span>
                <span className="text-stone-400 text-xs">Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[55%] flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600 mb-2">
              Welcome back
            </p>
            <h1
              className="text-3xl font-semibold text-stone-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Sign in to continue
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide">
                Email address
              </label>
              <input
                type="email"
                ref={emailRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full h-11 px-4 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setRememberMe((v) => !v)}
                className="inline-flex items-center gap-2 text-sm text-stone-600"
              >
                <span
                  className={`w-4 h-4 rounded border ${rememberMe ? "bg-orange-500 border-orange-500" : "bg-white border-stone-300"}`}
                >
                  {rememberMe && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                      aria-hidden="true"
                    >
                      <polyline
                        points="20 6 9 17 4 12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                Remember me
              </button>
              <button
                type="button"
                className="text-sm text-orange-600 font-medium hover:text-orange-700"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm rounded-xl transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20 hover:shadow-orange-500/30"
            >
              {loading ? "Signing in�" : "Sign in"}
            </button>

            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-xs text-stone-400 font-medium">
                or continue with
              </span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            <button
              type="button"
              disabled={loading}
              className="w-full h-11 flex items-center justify-center gap-2.5 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-medium text-sm rounded-xl transition-colors disabled:opacity-60"
            >
              <svg
                className="w-4.5 h-4.5 flex-shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M21.6 12.23c0-.7-.06-1.37-.18-2.02H12v3.82h5.39a4.6 4.6 0 01-1.99 3.02v2.5h3.23c1.89-1.74 2.97-4.31 2.97-7.32z"
                  fill="#4285F4"
                />
                <path
                  d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.23-2.5c-.9.6-2.06.96-3.38.96-2.6 0-4.8-1.76-5.59-4.13H.9v2.62A10 10 0 0012 22z"
                  fill="#34A853"
                />
                <path
                  d="M6.41 18.81A6.05 6.05 0 016 15.7V13.08H2.77A10 10 0 00.9 16.8c1.12 2.15 3.14 3.96 5.51 5.01z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 3.96c1.47 0 2.8.5 3.84 1.48l2.88-2.88A9.96 9.96 0 0012 0C7.41 0 3.37 2.7 1.37 6.64l3.79 2.94C6.1 5.69 8.67 3.96 12 3.96z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-sm text-stone-500 mt-6">
              Don�t have an account?{" "}
              <button
                type="button"
                onClick={onNavigateRegister}
                className="text-orange-600 font-semibold hover:text-orange-700"
              >
                Create one
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
