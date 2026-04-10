import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { LANDING_THEME } from "../../constants/theme-landing.js";

const SERVER_URL =
  import.meta && import.meta.env && import.meta.env.VITE_SERVER_URL
    ? import.meta.env.VITE_SERVER_URL
    : "http://127.0.0.1:5000";

const LoginDialog = ({ isOpen, onClose, onSignupClick, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setEmail("");
      setPassword("");
      setError("");
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

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

      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(`${SERVER_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Incorrect username or password");
      }

      // Store token in cookies (expires in 1 day)
      const maxAge = 24 * 60 * 60;
      document.cookie = `access_token=${data.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;

      // Notify parent component
      if (onLoginSuccess) onLoginSuccess();

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-white/10 p-8 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="mb-8 text-center">
          <h2
            className={`text-2xl mb-2 ${LANDING_THEME.typography.weight.heading} ${LANDING_THEME.colors.text.heading}`}
          >
            Welcome Back
          </h2>
          <p className={`text-sm ${LANDING_THEME.colors.text.subtitle}`}>
            Login to continue your magical story journey.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200">
              {error}
            </div>
          )}
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2b7fff]"
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2b7fff]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.primary}`}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Signing In..." : "Sign In"}
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
              setError("Google Login Failed");
            }}
            useOneTap
            shape="rectangular"
            theme="filled_blue"
            text="signin_with"
          />
        </div>

        <div className="mt-6 text-center">
          <p className={`text-sm ${LANDING_THEME.colors.text.subtitle}`}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSignupClick}
              className={`${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.brand} hover:underline`}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginDialog;
