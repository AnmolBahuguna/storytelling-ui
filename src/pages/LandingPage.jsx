import React, { useState, useEffect } from "react";
import HeroSection from "../components/landing/heroSection";
import { PricingSection } from "../components/landing/pricing";
import { WhyChooseUs } from "../components/landing/whyChooseUs";
import Footer from "../components/ui/footer";
import Header from "../components/ui/header";
import { LANDING_THEME } from "../constants/theme-landing";

const LandingPage = () => {
  // Theme state: Initialize from localStorage, fallback to system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      // Optional: Check user's system preference if no saved theme exists
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return true;
      }
    }
    return false;
  });

  // Screen size state for responsive background
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Toggle class on the HTML document and save choice to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <div
      className={`landing-shell relative min-h-screen ${LANDING_THEME.typography.family.main} overflow-hidden`}
      style={{
        backgroundImage: isMobile
          ? (isDarkMode ? 'url("/darkbackground.jpg")' : 'url("/lightmodebg.jpeg")')
          : (isDarkMode ? 'url("/pcdarkbackground.jpeg")' : 'url("/pclightbg.jpeg")'),
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen bg-transparent">
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="flex-grow">
          <HeroSection />
          <WhyChooseUs />
          <PricingSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
