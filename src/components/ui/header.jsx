import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { LANDING_THEME } from "../../constants/theme-landing.js";
import LoginDialog from "./loginDialog.jsx";
import SignupDialog from "./signupDialog.jsx";
import { authAPI } from "../../services/api.js";

const Header = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status by looking for the JWT token in cookies
  const checkAuthStatus = () => {
    setIsLoggedIn(authAPI.isAuthenticated());
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
    { name: "Create Story", href: "/dashboard" },
    { name: "Story Library", href: "/dashboard" },
  ];

  const handleLogout = () => {
    authAPI.logout();
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

  const handleNavClick = (event, href) => {
    event.preventDefault();
    if (href === "/") {
      navigate("/");
    } else if (isLoggedIn) {
      navigate(href);
    } else {
      setIsSignupOpen(true);
    }
  };

  return (
    <>
      <header
        className={`fixed left-3 right-3 top-3 z-50 rounded-2xl border border-violet-300/50 bg-white/90 shadow-lg shadow-violet-950/20 backdrop-blur-md transition-all duration-300 dark:bg-[#0d0a3d]/75 dark:border-violet-400/30 dark:shadow-violet-950/40 lg:left-[4.8%] lg:right-[4.8%] lg:top-7 ${
          isScrolled
            ? "py-3"
            : "py-3.5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-5 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className={`p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 flex items-center justify-center`}
            >
              <img
                src="/elephant.jpg"
                alt="StoryAI Logo"
                className="h-10 w-10 rounded-full shadow-sm sm:h-11 sm:w-11 lg:h-12 lg:w-12"
              />
            </div>
            <span
              className={`text-xl lg:text-[1.65rem] ${LANDING_THEME.typography.weight.heading} ${LANDING_THEME.colors.text.heading} tracking-tight ${LANDING_THEME.typography.family.main}`}
            >
              Tara Story AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className={`relative py-2 text-base ${LANDING_THEME.typography.weight.subtitle} text-[#355361] hover:text-[#E9684A] dark:text-slate-300 dark:hover:text-[#FF6848] transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#ff7043] after:transition-all ${link.href === "/" && location.pathname === "/" ? "after:w-full" : "after:w-0"}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-3">
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
                    className={`text-sm px-4 py-2.5 rounded-full ${LANDING_THEME.typography.weight.subtitle} text-[#355361] hover:text-[#E9684A] dark:text-slate-300 dark:hover:text-white transition-colors`}
                >
                  Logout
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className={`text-sm px-6 py-2.5 rounded-full ${LANDING_THEME.typography.weight.subtitle} ${LANDING_THEME.components.button.primary} transform hover:-translate-y-0.5`}
                >
                  Let's Go! ✦
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className={`text-sm px-4 py-2.5 rounded-full ${LANDING_THEME.typography.weight.subtitle} text-[#355361] hover:text-[#E9684A] dark:text-slate-300 dark:hover:text-white transition-colors`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsSignupOpen(true)}
                  className={`text-sm px-6 py-2.5 rounded-full ${LANDING_THEME.typography.weight.subtitle} ${LANDING_THEME.components.button.primary} transform hover:-translate-y-0.5 shadow-md`}
                >
                  Let's Go! ✦
                </button>
              </>
            )}
          </div>

          {/* Mobile Controls (Menu Toggle & Theme Toggle) */}
          <div className="flex items-center gap-2 lg:hidden">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${LANDING_THEME.colors.text.subtitle} hover:bg-slate-100 dark:hover:bg-white/10`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              onClick={isLoggedIn ? () => navigate("/dashboard") : () => setIsSignupOpen(true)}
              className={`rounded-full px-4 py-2 text-xs ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.primary}`}
            >
              Let's Go! ✦
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-white/10 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={(event) => {
                  handleNavClick(event, link.href);
                  setMobileMenuOpen(false);
                }}
                className={`${LANDING_THEME.typography.weight.bold} text-[#355361] hover:text-[#E9684A] dark:text-slate-300 dark:hover:text-[#FF6848]`}
              >
                {link.name}
              </Link>
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
