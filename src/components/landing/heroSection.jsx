import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LANDING_THEME } from "../../constants/theme-landing.js";
import { StarsBackground as StarsBackgroundBlue } from "../animate-ui/components/backgrounds/stars-blue";

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

  const handleExplore = (e) => {
    e.preventDefault();
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
      className="landing-hero relative min-h-screen overflow-hidden bg-transparent text-[#294B58] dark:text-white"
    >

      <img
        src="/clouds-background1.png"
        alt=""
        aria-hidden="true"
        className="landing-hero__cloud-background pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover object-bottom opacity-65 mix-blend-screen"
      />
      <img
        src="/magic-hero.png"
        alt=""
        aria-hidden="true"
        className="landing-hero__background hero-image absolute z-[3] hidden object-contain object-[center_right] opacity-95 lg:block"
      />
      <div className="absolute inset-0 z-[2] bg-transparent dark:bg-gradient-to-r dark:from-[#08052f]/85 dark:via-[#08052f]/65 dark:to-transparent" />
      <div className="absolute inset-0 z-[2] bg-transparent dark:bg-gradient-to-t dark:from-[#08052f]/75 dark:via-transparent dark:to-[#08052f]/10" />
      <div className="pointer-events-none absolute inset-0 z-[2] hidden opacity-80 dark:block">
        <StarsBackgroundBlue
          speed={100}
          pointerEvents={false}
          className="bg-transparent"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1440px] items-start px-5 pb-10 pt-24 lg:px-16 lg:pb-16 lg:pt-[10.5rem]">
        <div className="flex w-full max-w-xl flex-col items-center text-center lg:max-w-[39rem] lg:items-start lg:text-left">
          {/* Top Badge from Theme */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-7 text-[9px] font-bold uppercase tracking-[0.22em] text-[#FF6848] dark:text-[#ffb58d] lg:text-[10px] lg:tracking-[0.3em]"
          >
            ✦ Magical Learning Stories
          </motion.div>

          {/* Main Heading using Theme Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-5 text-[2.65rem] font-black leading-[1.02] tracking-tight text-[#111111] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] dark:text-white dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] lg:text-[5.6rem] lg:leading-[0.94]"
          >
            Every Story{" "}
            <br className="lg:hidden" />
            Begins
            <br />
            With a Little
            <br />
            <span className="bg-gradient-to-r from-[#FF6848] via-[#FF985C] to-[#0EA5E9] bg-clip-text text-transparent dark:from-[#ff9b70] dark:via-[#ffb86c] dark:to-[#38bdf8]">
              Magic.
            </span>
          </motion.h1>

          <img
            src="/magic-hero-mobile.png"
            alt="Magical elephant reading a storybook beside an enchanted castle"
            className="landing-hero__mobile-art mb-7 block h-[14rem] w-full max-w-[20rem] object-contain object-center lg:hidden"
          />

          {/* Subtitle using Theme Typography */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 max-w-[20rem] text-[13px] font-semibold leading-relaxed text-[#111111] drop-shadow-md dark:text-white dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] lg:max-w-md lg:text-base"
          >
            Tara Story AI turns learning into an adventure with{" "}
            <span className="text-[#FF6848]">personalized stories</span>, magical
            worlds, and <span className="text-[#FF6848]">age-appropriate lessons</span>{" "}
            designed for curious kids.
          </motion.p>

          {/* Try Now Call-to-Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
              <button
                onClick={handleTryNow}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ffb08e] bg-gradient-to-b from-[#ff986b] to-[#ed5d43] px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-950/40 transition hover:-translate-y-1 hover:brightness-110"
              >
                ✦ Create a Story
              </button>
              <Link
                to="/dashboard"
                onClick={handleExplore}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white bg-white/95 px-7 py-3 text-sm font-bold text-[#315064] shadow-lg shadow-white/20 transition hover:-translate-y-1 hover:bg-white hover:text-[#E9684A] dark:border-sky-300/60 dark:bg-sky-600/90 dark:text-white dark:shadow-lg dark:shadow-sky-900/30 dark:hover:bg-sky-500"
              >
                <BookOpen size={17} className="text-sky-600 dark:text-sky-300" />
                Explore Story Library
                <ArrowRight size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
