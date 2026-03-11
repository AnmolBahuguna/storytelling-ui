import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, LogOut, LayoutDashboard } from "lucide-react";
import { LANDING_THEME } from "../../constants/theme-landing.js";
import elephantLogo from "../../../public/elephant.jpg";
import LoginDialog from "./loginDialog.jsx";
import SignupDialog from "./signupDialog.jsx";

const Header = ({ isDarkMode, toggleTheme }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper to check for auth cookie
  const checkAuth = () => {
    const hasToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));
    setIsAuthenticated(!!hasToken);
  };

  useEffect(() => {
    checkAuth();
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    // Clear cookie
    document.cookie =
      "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsAuthenticated(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "backdrop-blur-sm shadow-sm border-b border-none dark:border-white/10 py-3" : "bg-transparent border-b border-transparent py-4"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
              <img
                src={elephantLogo}
                alt="StoryAI Logo"
                className="w-12 h-12 rounded-xl"
              />
            </div>
            <span
              className={`text-xl md:text-2xl ${LANDING_THEME.typography.weight.heading} ${LANDING_THEME.colors.text.heading} tracking-tight ${LANDING_THEME.typography.family.main}`}
            >
              StoryAI
            </span>
          </Link>

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

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-story"
                  className={`flex items-center gap-2 text-sm px-6 py-2.5 rounded-full ${LANDING_THEME.typography.weight.subtitle} ${LANDING_THEME.components.button.secondary}`}
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all ${LANDING_THEME.typography.weight.bold}`}
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className={`text-sm px-6 py-2.5 rounded-full ${LANDING_THEME.typography.weight.subtitle} ${LANDING_THEME.components.button.secondary}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsSignupOpen(true)}
                  className={`text-sm px-6 py-2.5 rounded-full ${LANDING_THEME.typography.weight.subtitle} ${LANDING_THEME.components.button.primary} transform hover:-translate-y-0.5`}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

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
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-center py-3 rounded-full w-full ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.secondary}`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-center py-3 rounded-full w-full font-bold text-red-500 bg-red-50 dark:bg-red-900/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsLoginOpen(true);
                    }}
                    className={`text-center py-3 rounded-full w-full ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.secondary}`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSignupOpen(true);
                    }}
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

      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={checkAuth}
        onSignupClick={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />
      <SignupDialog
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onLoginClick={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
};

export default Header;
