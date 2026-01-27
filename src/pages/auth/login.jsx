import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import Particles from "../../components/ui/Particles";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Login attempt:", formData);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // navigate('/dashboard'); // Uncomment when dashboard is ready
    }, 1500);
  };

  return (
    // Updated background to deep space black (#020205)
    <div className="relative w-full h-screen bg-[#020205] overflow-hidden flex items-center justify-center font-sans">
      {/* --- Background: Particles Effect (Starfield) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      {/* --- Foreground: Glassmorphism Login Card --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Adjusted backdrop-blur and border for better contrast on black */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="text-slate-400 mt-2 text-sm font-medium">
                Enter your credentials to access your stories
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="block w-full pl-11 pr-4 py-3.5 bg-black/40 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-11 pr-12 py-3.5 bg-black/40 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-3 bg-[#020205] text-slate-500 rounded-full">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <motion.button
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="w-full bg-white/5 border border-white/10 text-white font-medium py-3.5 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#fff"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#fff"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fff"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#fff"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </motion.button>
          </div>

          {/* Footer Area */}
          <div className="px-8 py-4 bg-black/40 text-center border-t border-white/5">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
