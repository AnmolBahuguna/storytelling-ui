import React, { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { LANDING_THEME } from "../../constants/theme-landing";

const SERVER_URL =
  import.meta && import.meta.env && import.meta.env.VITE_SERVER_URL
    ? import.meta.env.VITE_SERVER_URL
    : "http://127.0.0.1:5000";

const SignupDialog = ({ isOpen, onClose, onLoginClick }) => {
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Prevent scrolling on the background when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset state when opened
      setName("");
      setEmail("");
      setPassword("");
      setError("");
      setSuccess(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Parse FastAPI 422 errors into readable strings
  const parseFastAPIError = (data, defaultMsg) => {
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((err) => `${err.loc[err.loc.length - 1]}: ${err.msg}`)
        .join(", ");
    } else if (data.detail) {
      return data.detail;
    }
    return defaultMsg;
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${SERVER_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Google authentication failed");
      }

      // Store token in cookies
      const maxAge = 24 * 60 * 60;
      document.cookie = `access_token=${data.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Since we got a token, they are fully registered AND logged in
        // We can just close or refresh status (the header does checkAuthStatus on close)
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Direct Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          parseFastAPIError(data, "Registration failed. Please try again."),
        );
      }

      setSuccess(true);

      // Successfully registered. Switch to login screen after a short delay.
      setTimeout(() => {
        onLoginClick();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-white/10 p-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8 text-center mt-2">
          <h2
            className={`text-2xl mb-2 ${LANDING_THEME.typography.weight.heading} ${LANDING_THEME.colors.text.heading}`}
          >
            Join the Magic
          </h2>
          <p className={`text-sm ${LANDING_THEME.colors.text.subtitle}`}>
            Create an account to start generating unlimited stories.
          </p>
        </div>

        {/* Global Error/Success Messages */}
        {error && (
          <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900/50">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2">
            <CheckCircle2 size={16} />
            Account created! Redirecting to login...
          </div>
        )}

        {/* Signup Form */}
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label
              className={`block text-sm mb-1.5 ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.heading}`}
            >
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2b7fff] transition-all"
              required
            />
          </div>
          <div>
            <label
              className={`block text-sm mb-1.5 ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.heading}`}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@storyai.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2b7fff] transition-all"
              required
            />
          </div>
          <div>
            <label
              className={`block text-sm mb-1.5 ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.heading}`}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2b7fff] transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-3 mt-6 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.primary}`}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-slate-700"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setError("Google Signup Failed");
            }}
            useOneTap
            shape="rectangular"
            theme="filled_blue"
            text="signup_with"
          />
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className={`text-sm ${LANDING_THEME.colors.text.subtitle}`}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={onLoginClick}
              className={`${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.brand} hover:underline`}
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupDialog;
