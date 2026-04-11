import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bike, Rocket, Gamepad2, Plane, Car, Palette, Music, Trophy, Dribbble, Tent } from "lucide-react";

const FUN_FACTS = [
  "Did you know? Octopuses have three hearts and blue blood!",
  "Space is completely silent because there's no air to carry sound.",
  "A group of flamingos is called a 'flamboyance'.",
  "Honey never spoils. It can last for thousands of years!",
  "Bananas actually grow upside down reaching for the sun!",
  "Wombats are the only animals in the world that have cube-shaped poop!",
  "A day on Venus is longer than a year on Venus.",
  "Butterflies can taste their food using their feet!",
  "Sea otters hold hands when they sleep so they don't drift apart.",
  "Sloths can hold their breath underwater for up to 40 minutes!",
  "Cows have best friends and get stressed when separated.",
  "A snail can sleep for three years at a time.",
  "Elephants are the only animals that can't jump.",
  "A blue whale's heart is the size of a small car.",
  "Starfish don't have brains; they use a complex nervous system instead.",
  "Kangaroos can't walk backward because of their thick muscular tail.",
  "A crocodile cannot stick its tongue out.",
  "Rabbits can see behind them without turning their heads.",
  "Tigers have striped skin, not just striped fur.",
  "Cats can't taste sweetness.",
  "A polar bear's skin is actually black, and its fur is clear, not white!",
  "Penguins can jump up to 6 feet in the air.",
  "Giraffes have no vocal cords.",
  "The unicorn is the national animal of Scotland.",
  "Pigs can't look up into the sky.",
  "Chameleons change color to communicate and regulate their body temperature.",
  "Dolphins sleep with one eye open to stay alert.",
  "An ostrich's eye is bigger than its brain.",
  "A group of porcupines is called a prickle.",
  "Koalas sleep up to 22 hours a day!",
  "Hippos secrete a red oily liquid that acts like sunscreen.",
  "A cheetah can go from 0 to 60 mph in just 3 seconds."
];

// Array of animal emojis to cycle through
const ANIMAL_EMOJIS = [
  "🦊", "🐼", "🐯", "🦁", "🐸", "🐒", 
  "🐘", "🦒", "🦓", "🦋", "🐢", "🐳"
];

const LoadingScreen = () => {
  const [factIndex, setFactIndex] = useState(() => Math.floor(Math.random() * FUN_FACTS.length));
  const [iconIndex, setIconIndex] = useState(0);

  // Generate random data for background floating animals
  const floatingAnimals = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      animal: ANIMAL_EMOJIS[Math.floor(Math.random() * ANIMAL_EMOJIS.length)],
      startX: Math.random() * 100, // vw
      startY: Math.random() * 100, // vh
      endX: Math.random() * 100,   // vw
      endY: Math.random() * 100,   // vh
      duration: 20 + Math.random() * 40, 
      delay: Math.random() * -30, 
      size: 2 + Math.random() * 4, // rem
      opacity: 0.15 + Math.random() * 0.3, 
    }));
  }, []);

  useEffect(() => {
    // Cycle through a random fact every 4 seconds
    const factInterval = setInterval(() => {
      setFactIndex((prev) => {
        let next;
        do {
          next = Math.floor(Math.random() * FUN_FACTS.length);
        } while (next === prev);
        return next;
      });
    }, 4000);

    // Cycle through the animals
    const iconInterval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % ANIMAL_EMOJIS.length);
    }, 1500);

    return () => {
      clearInterval(factInterval);
      clearInterval(iconInterval);
    };
  }, []);

  const CurrentAnimal = ANIMAL_EMOJIS[iconIndex];

  return (
    <>
      {/* Full-screen floating background animals */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingAnimals.map((item) => (
          <motion.div
            key={item.id}
            initial={{ x: `${item.startX}vw`, y: `${item.startY}vh` }}
            animate={{ 
              x: [`${item.startX}vw`, `${item.endX}vw`, `${item.startX}vw`],
              y: [`${item.startY}vh`, `${item.endY}vh`, `${item.startY}vh`],
              rotate: [0, 45, -45, 0]
            }}
            transition={{ 
              duration: item.duration, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: item.delay
            }}
            className="absolute top-0 left-0 drop-shadow-md"
            style={{ fontSize: `${item.size}rem`, opacity: item.opacity }}
          >
            {item.animal}
          </motion.div>
        ))}
      </div>

      <motion.div
        key="loading-screen"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="relative z-10 w-full max-w-2xl mx-auto my-auto overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-700/50 p-8 md:p-16 shadow-2xl flex flex-col items-center justify-center text-center transition-colors duration-700 min-h-[400px]"
      >
      {/* Vibrant Fun Facts Box (Moved to top) */}
      <div className="w-full min-h-[160px] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50/50 via-fuchsia-50/50 to-pink-50/50 dark:from-indigo-950/30 dark:via-fuchsia-950/30 dark:to-pink-950/30 rounded-3xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] mb-8">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6"
        >
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-purple-500/30">
            ✨ Fun Fact
          </span>
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            initial={{ opacity: 0, y: 40, scale: 0.6, rotateX: 45 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -40, scale: 0.6, filter: "blur(4px)" }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20, 
              duration: 0.6 
            }}
            className="font-extrabold text-2xl md:text-3xl lg:text-4xl px-4 leading-tight tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 dark:from-violet-400 dark:via-fuchsia-400 dark:to-orange-400 drop-shadow-sm"
          >
            {FUN_FACTS[factIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Animated Zoo Scene */}
      <div className="relative h-40 md:h-48 w-full max-w-sm mx-auto flex items-end justify-center mb-8 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 to-green-300 dark:from-sky-900 dark:to-green-900 shadow-inner border-4 border-white/80 dark:border-slate-800 relative shadow-[inset_0_3px_15px_rgba(0,0,0,0.1)]">
        {/* Sun */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-4 right-4 text-4xl md:text-5xl drop-shadow-md"
        >
          ☀️
        </motion.div>
        
        {/* Moving Clouds */}
        <motion.div 
          animate={{ x: ["-100%", "400%"] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
          className="absolute top-6 left-0 text-3xl md:text-4xl opacity-80"
        >
          ☁️
        </motion.div>
        <motion.div 
          animate={{ x: ["-100%", "400%"] }} 
          transition={{ duration: 28, repeat: Infinity, ease: "linear", delay: 5 }} 
          className="absolute top-2 left-10 text-2xl md:text-3xl opacity-60"
        >
          ☁️
        </motion.div>

        {/* Trees */}
        <div className="absolute bottom-[-5px] left-2 md:left-4 text-5xl md:text-6xl origin-bottom animate-pulse">🌴</div>
        <div className="absolute bottom-[-5px] right-2 md:right-4 text-5xl md:text-6xl origin-bottom animate-pulse">🌳</div>

        {/* Dancing Main Animal */}
        <div className="relative z-10 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={iconIndex}
              initial={{ opacity: 0, x: -80, y: 15, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, x: 0, y: [0, -25, 0], scale: 1, rotate: 0 }}
              exit={{ opacity: 0, x: 80, y: 15, scale: 0.5, rotate: 20 }}
              transition={{ duration: 0.9, type: "spring", bounce: 0.6 }}
              className="text-7xl md:text-8xl drop-shadow-xl"
            >
              {CurrentAnimal}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
        Weaving Your Story...
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-2 font-medium">
        Please wait while we gather words and paint pictures.
      </p>
    </motion.div>
    </>
  );
};

export default LoadingScreen;
