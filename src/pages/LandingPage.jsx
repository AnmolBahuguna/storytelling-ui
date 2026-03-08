import React, { useState, useEffect } from "react";
import HeroSection from "../components/landing/heroSection";
import { PricingSection } from "../components/landing/pricing";
import { WhyChooseUs } from "../components/landing/whyChooseUs";
import Footer from "../components/ui/footer";
import Header from "../components/ui/header";

import ClickSpark from "../components/ClickSpark";
import { StarsBackground as StarsBackgroundBlue } from "../components/animate-ui/components/backgrounds/stars-blue";
import { StarsBackground as StarsBackgroundWhite } from "../components/animate-ui/components/backgrounds/stars-light";
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
      className={`relative min-h-screen transition-colors duration-700 ${
        isDarkMode ? "bg-gradient-to-b from-blue-900 to-blue-950" : "bg-white"
      } ${LANDING_THEME.typography.family.main} overflow-hidden`}
    >
      {/* Spark color matches the active theme */}
      <ClickSpark
        sparkColor={isDarkMode ? "#ffffff" : "#2b7fff"}
        sparkSize={12}
        sparkRadius={20}
        sparkCount={10}
        duration={500}
      >
        {/* Background Layer Container */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Dynamically swap background component based on theme */}
          {isDarkMode ? (
            <StarsBackgroundBlue speed={100} />
          ) : (
            <StarsBackgroundWhite speed={100} />
          )}
        </div>

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
      </ClickSpark>
    </div>
  );
};

export default LandingPage;
