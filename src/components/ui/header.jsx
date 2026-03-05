import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, BookOpen } from "lucide-react";
import { LANDING_THEME } from "../../constants/theme-landing";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for glassmorphism/shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-transparent backdrop-blur-sm shadow-sm border-b border-none py-3"
          : "bg-transparent border-b border-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className={`p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 flex items-center justify-center ${LANDING_THEME.components.button.primary}`}
          >
            <BookOpen size={22} strokeWidth={2.5} />
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
              className={`text-sm ${LANDING_THEME.typography.weight.subtitle} ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.heading} transition-colors`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className={`text-sm px-6 py-2.5 rounded-full ${LANDING_THEME.typography.weight.subtitle} ${LANDING_THEME.components.button.secondary}`}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={`text-sm px-6 py-2.5 rounded-full ${LANDING_THEME.typography.weight.subtitle} ${LANDING_THEME.components.button.primary} transform hover:-translate-y-0.5`}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden p-2 ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.heading} transition-colors`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-transparent backdrop-blur-md border-t border-slate-100 shadow-xl py-4 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.colors.text.subtitle} hover:${LANDING_THEME.colors.text.heading}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <hr className="border-slate-100 my-2" />
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              className={`text-center py-3 rounded-full ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.secondary}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`text-center py-3 rounded-full ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.primary}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
