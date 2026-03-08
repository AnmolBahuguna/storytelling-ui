import React, { useEffect } from "react";
import { X } from "lucide-react";
import { LANDING_THEME } from "../../constants/theme-landing";

const LoginDialog = ({ isOpen, onClose, onSignupClick }) => {
  // Prevent scrolling on the background when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
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

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label
              className={`block text-sm mb-1.5 ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.heading}`}
            >
              Email Address
            </label>
            <input
              type="email"
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
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2b7fff] transition-all"
              required
            />
          </div>

          <div className="flex justify-end mb-4">
            <a
              href="#"
              className={`text-sm ${LANDING_THEME.colors.text.brand} hover:underline`}
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`w-full py-3 mt-4 rounded-xl ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.primary}`}
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
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
