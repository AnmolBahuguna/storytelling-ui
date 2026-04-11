import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { LANDING_THEME } from "../../constants/theme-landing.js";
import LoginDialog from "./loginDialog.jsx";
import SignupDialog from "./signupDialog.jsx";

const Header = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status by looking for the JWT token in cookies
  const checkAuthStatus = () => {
    const hasToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    setIsLoggedIn(!!hasToken);
  };

  useEffect(() => {
    checkAuthStatus(); // Check on mount

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // --- KEY ADDITION: Listen for the custom event from the Hero section ---
    const handleOpenSignup = () => setIsSignupOpen(true);
    window.addEventListener("open-signup", handleOpenSignup);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("open-signup", handleOpenSignup);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
  ];

  const handleLogout = () => {
    // Clear the access token cookie
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleLogoutMobile = () => {
    setMobileMenuOpen(false);
    handleLogout();
  };

  const handleGetStartedMobile = () => {
    setMobileMenuOpen(false);
    setIsSignupOpen(true);
  };

  const handleLoginMobile = () => {
    setMobileMenuOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? " backdrop-blur-sm shadow-sm border-b border-none dark:border-white/10 py-3"
            : "bg-transparent border-b border-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className={`p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 flex items-center justify-center`}
            >
              <img
                src="/elephant.jpg"
                alt="StoryAI Logo"
                className="w-12 h-12 rounded-xl shadow-sm"
              />
            </div>
            <span
              className={`text-xl md:text-2xl ${LANDING_THEME.typography.weight.heading} ${LANDING_THEME.colors.text.heading} tracking-tight ${LANDING_THEME.typography.family.main}`}
            >
              StoryAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm ${LANDING_THEME.typography.weight.subtitle} ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.brand} transition-colors`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Auth & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className={`p-2 mr-2 rounded-full transition-colors ${LANDING_THEME.colors.text.subtitle} hover:bg-slate-100 dark:hover:bg-white/10`}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}

            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
                  className={`text-sm px-4 py-2.5 rounded-full ${LANDING_THEME.typography.weight.subtitle} text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors`}
                >
                  Logout
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className={`text-sm px-6 py-2.5 rounded-full ${LANDING_THEME.typography.weight.subtitle} ${LANDING_THEME.components.button.primary} transform hover:-translate-y-0.5`}
                >
                  Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className={`text-sm px-4 py-2.5 rounded-full ${LANDING_THEME.typography.weight.subtitle} text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsSignupOpen(true)}
                  className={`text-sm px-6 py-2.5 rounded-full ${LANDING_THEME.typography.weight.subtitle} ${LANDING_THEME.components.button.primary} transform hover:-translate-y-0.5 shadow-md`}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Controls (Menu Toggle & Theme Toggle) */}
          <div className="flex items-center gap-2 md:hidden">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${LANDING_THEME.colors.text.subtitle} hover:bg-slate-100 dark:hover:bg-white/10`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              className={`p-2 ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.heading} transition-colors`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-white/10 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.brand}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <hr className="border-slate-100 dark:border-white/10 my-2" />

            <div className="flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/dashboard");
                    }}
                    className={`text-center py-3 rounded-full ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.primary}`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogoutMobile}
                    className={`text-center py-3 rounded-full w-full ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.secondary}`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLoginMobile}
                    className={`text-center py-3 rounded-full w-full ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.secondary}`}
                  >
                    Login
                  </button>
                  <button
                    onClick={handleGetStartedMobile}
                    className={`text-center py-3 rounded-full ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.primary}`}
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modals Mounted Here */}
      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          checkAuthStatus(); // Update auth UI immediately if they logged in
        }}
        onSignupClick={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
        onLoginSuccess={() => {
          checkAuthStatus();
          navigate("/dashboard");
        }}
      />

      <SignupDialog
        isOpen={isSignupOpen}
        onClose={() => {
          setIsSignupOpen(false);
          checkAuthStatus();
        }}
        onLoginClick={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
};

export default Header;
