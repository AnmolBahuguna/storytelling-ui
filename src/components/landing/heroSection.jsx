import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LANDING_THEME } from "../../constants/theme-landing.js";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleCreateStory = () => {
    console.log("Create Story button clicked");

    // Check if user is already logged in by looking for the access token
    const hasToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));

    if (hasToken) {
      // If logged in, send them straight to the dashboard
      navigate("/dashboard");
    } else {
      // If not logged in, trigger the custom event to open the Signup modal
      window.dispatchEvent(new Event("open-signup"));
    }
  };

  const handleExploreLibrary = () => {
    console.log("Explore Library button clicked");
    // For now, navigate to dashboard since we don't have a library page yet
    navigate("/dashboard");
  };

  const handleLetsGo = () => {
    console.log("Let's Go button clicked");
    // Check if user is already logged in
    const hasToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));

    if (hasToken) {
      navigate("/dashboard");
    } else {
      window.dispatchEvent(new Event("open-signup"));
    }
  };

  return (
    <section
      className={`flex-grow flex flex-col justify-center py-10 px-3 sm:py-14 sm:px-4 relative lg:min-h-[calc(100vh-80px)] lg:py-8 lg:px-8 ${LANDING_THEME.typography.family.main}`}
    >
      {/* Main Content */}
      <div       className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto text-center px-1 sm:px-4 lg:relative lg:z-10 lg:items-start lg:justify-center lg:text-left lg:px-0 lg:pr-[46%] lg:translate-x-[2%] lg:translate-y-[20%]">
        {/* Magical Learning Stories Badge */}
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-slate-900 dark:text-white text-[clamp(1.8rem,8vw,2.25rem)] sm:text-4xl md:text-5xl lg:text-[2.25rem] font-extrabold dark:font-bold mb-4 leading-[1.08] relative max-w-xl"
        >
          Every Story Begins{" "}
          <br className="hidden lg:block" />
          With a Little{" "}
          <br className="hidden lg:block" />
          <span className="text-[#5B21B6] dark:text-[#BB86FC]">Magic.</span>
          {/* Crescent Moon */}
          <span className="absolute -right-8 top-0 text-4xl"></span>
        </motion.h1>

        {/* Center Image for Mobile View */}
        <motion.div
          className="hero-image-float w-full max-w-[360px] sm:max-w-[500px] mx-auto will-change-transform lg:absolute lg:right-[10%] lg:top-0 lg:w-[27%]"
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ opacity: { duration: 0.5 }, scale: { duration: 0.5 } }}
            src="/heromid.jpeg"
            alt="Magical Scene"
            className="block w-full h-auto mb-6 lg:mb-0"
            style={{ backfaceVisibility: "hidden" }}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-slate-900 dark:text-white text-[1.05rem] sm:text-lg font-semibold dark:font-normal max-w-md mx-auto mb-5 leading-relaxed lg:mx-0 lg:max-w-md lg:text-sm"
        >
          Tara Story AI turns learning into an adventure with{" "}
          <span className="text-[#ff890b] dark:text-[#ffa600]">personalized stories, magical worlds,</span>{" "}
          and age-appropriate lessons designed for{" "}
          <span className="text-[#fd7f11] dark:text-[#CE93D8]">curious kids.</span>
        </motion.p>
        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto lg:mx-0 lg:max-w-md"
        >
          <button
            onClick={handleCreateStory}
            className="w-full text-white py-3 px-4 rounded-xl font-bold text-base sm:text-lg lg:py-2.5 lg:px-3 lg:text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(to right, #FF7043, #FFA726)'
            }}
          >
            <span></span>
            Create a Story
          </button>
          <button
            onClick={handleExploreLibrary}
            className="w-full text-white py-3 px-4 rounded-xl font-bold text-base sm:text-lg lg:py-2.5 lg:px-3 lg:text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#42426F'
            }}
          >
            <span>📚</span>
            Explore Story Library
            <span>→</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
