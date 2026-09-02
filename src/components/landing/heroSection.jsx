import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LANDING_THEME } from "../../constants/theme-landing.js";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleTryNow = (e) => {
    e.preventDefault();

    // Check if user is already logged in by looking for the access token
    const hasToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="));

    if (hasToken) {
      // If logged in, send them straight to the dashboard
      navigate("/dashboard");
    } else {
      // If not logged in, trigger the custom event to open the Signup modal
      // The Header component is already set up to listen for this event!
      window.dispatchEvent(new Event("open-signup"));
    }
  };

  return (
    <section
      className={`${LANDING_THEME.colors.background.transparent} pt-32 pb-10 md:pt-40 md:pb-14 overflow-hidden text-center relative ${LANDING_THEME.typography.family.main}`}
    >
      <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Top Badge from Theme */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`px-4 py-1.5 rounded-full mb-8 ${LANDING_THEME.components.badge.container} ${LANDING_THEME.components.badge.text}`}
        >
          Magical Stories In Seconds ✨
        </motion.div>

        {/* Main Heading using Theme Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`${LANDING_THEME.typography.size.h1} ${LANDING_THEME.typography.weight.heading} ${LANDING_THEME.colors.text.heading} leading-[1.1] mb-6 tracking-tight`}
        >
          Unleash Your Child's <br />
          <span
            className={`bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 dark:from-violet-400 dark:via-fuchsia-400 dark:to-amber-400 bg-clip-text text-transparent inline-block mt-2`}
          >
            Imagination
          </span>
        </motion.h1>

        {/* Subtitle using Theme Typography */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`${LANDING_THEME.typography.size.subtitle} ${LANDING_THEME.colors.text.subtitle} ${LANDING_THEME.typography.weight.subtitle} max-w-2xl mx-auto leading-relaxed mb-10`}
        >
          Create magical, personalized stories for your children in seconds
          using the power of AI. Designed to spark wonder and safe learning. 🪄
        </motion.p>

        {/* Try Now Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            onClick={handleTryNow}
            className={`inline-block px-10 py-4 rounded-full text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${LANDING_THEME.typography.weight.bold} ${LANDING_THEME.components.button.primary}`}
          >
            Start My Adventure ✨
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
