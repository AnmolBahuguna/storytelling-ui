import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bike,
  Rocket,
  Gamepad2,
  Plane,
  Car,
  Palette,
  Music,
  Trophy,
  Dribbble,
  Tent,
} from "lucide-react";

const FUN_FACTS = [
  "Did you know? Octopuses have three hearts!",
  "Space is completely silent because there's no air.",
  "A group of flamingos is called a 'flamboyance'.",
  "Honey never spoils. It can last for thousands of years!",
  "Bananas actually grow upside down!",
  "Wombats have cube-shaped poop!",
  "A day on Venus is longer than its year.",
  "Butterflies can taste with their feet!",
  "Sea otters hold hands when they sleep so they don't drift apart.",
  "Sloths have a pocket under their arm to store snacks!",
];

// Array of kid-friendly icons to cycle through
const ICONS = [
  Dribbble, // Represents a ball/sports
  Bike,
  Rocket,
  Gamepad2,
  Plane,
  Car,
  Palette,
  Music,
  Trophy,
  Tent,
];

const LoadingScreen = () => {
  const [factIndex, setFactIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    // Cycle through the fun facts every 3.5 seconds
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FUN_FACTS.length);
    }, 3500);

    // Cycle through the icons very quickly (every 800ms)
    const iconInterval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % ICONS.length);
    }, 800);

    return () => {
      clearInterval(factInterval);
      clearInterval(iconInterval);
    };
  }, []);

  const CurrentIcon = ICONS[iconIndex];

  return (
    <motion.div
      key="loading-screen"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-2xl mx-auto my-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 md:p-16 shadow-lg flex flex-col items-center justify-center text-center transition-colors duration-700 min-h-[400px]"
    >
      {/* Quickly Changing Icon Box */}
      <div className="h-24 flex items-center justify-center mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={iconIndex}
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 30 }}
            transition={{ duration: 0.2 }}
            className="text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-slate-800 p-4 rounded-full"
          >
            <CurrentIcon size={48} strokeWidth={2} />
          </motion.div>
        </AnimatePresence>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
        Weaving Your Story...
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-12 font-medium">
        Please wait while we gather words and paint pictures.
      </p>

      {/* Minimal Fun Facts Box */}
      <div className="w-full min-h-[100px] flex flex-col items-center justify-center">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
          Fun Fact
        </span>
        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className="text-slate-700 dark:text-slate-300 font-medium text-lg px-4"
          >
            {FUN_FACTS[factIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
