import React, { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2, ArrowLeft, Mail } from "lucide-react";
import { LANDING_THEME } from "../../constants/theme-landing";

const SERVER_URL =
  import.meta && import.meta.env && import.meta.env.VITE_SERVER_URL
    ? import.meta.env.VITE_SERVER_URL
    : "http://localhost:8000";

const SignupDialog = ({ isOpen, onClose, onLoginClick }) => {
  // Step 1: Details | Step 2: OTP
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Prevent scrolling on the background when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset state when opened
      setStep(1);
      setName("");
      setEmail("");
      setPassword("");
      setOtp("");
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

  // STEP 1: Request OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${SERVER_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          parseFastAPIError(data, "Failed to send OTP. Please try again."),
        );
      }

      // Move to OTP verification step
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and Register
  const handleVerifyOTPAndSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${SERVER_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          username: email,
          password: password,
          name: name,
          otp: otp, // Sending the OTP collected in step 2
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
        {/* Navigation/Close Buttons */}
        {step === 2 && !success && (
          <button
            onClick={() => {
              setStep(1);
              setError("");
              setOtp("");
            }}
            className="absolute top-4 left-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8 text-center mt-2">
          {step === 1 ? (
            <>
              <h2
                className={`text-2xl mb-2 ${LANDING_THEME.typography.weight.heading} ${LANDING_THEME.colors.text.heading}`}
              >
                Join the Magic ✨
              </h2>
              <p className={`text-sm ${LANDING_THEME.colors.text.subtitle}`}>
                Create an account to start generating unlimited stories.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
                <Mail size={24} />
              </div>
              <h2
                className={`text-2xl mb-2 ${LANDING_THEME.typography.weight.heading} ${LANDING_THEME.colors.text.heading}`}
              >
                Verify your email
              </h2>
              <p className={`text-sm ${LANDING_THEME.colors.text.subtitle}`}>
                We've sent a 6-digit code to <br />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {email}
                </span>
              </p>
            </>
          )}
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

        {/* Forms */}
        {step === 1 ? (
          <form className="space-y-4" onSubmit={handleSendOTP}>
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
              disabled={loading}
              className={`w-full py-3 mt-6 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.primary}`}
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Sending Code..." : "Continue"}
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleVerifyOTPAndSignup}>
            <div>
              <label
                className={`block text-sm mb-1.5 text-center ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.heading}`}
              >
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Allow only numbers
                placeholder="000000"
                className="w-full text-center text-2xl tracking-[0.5em] font-mono px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2b7fff] transition-all"
                required
                disabled={success}
              />
            </div>

            <button
              type="submit"
              disabled={loading || success || otp.length !== 6}
              className={`w-full py-3 mt-6 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.primary}`}
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                disabled={loading || success}
                onClick={handleSendOTP}
                className={`text-sm ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.brand} hover:underline disabled:opacity-50`}
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* Footer (Only on Step 1) */}
        {step === 1 && (
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
        )}
      </div>
    </div>
  );
};

export default SignupDialog;
