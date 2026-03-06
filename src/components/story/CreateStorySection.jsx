import React from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  TreeDeciduous,
  Waves,
  Castle,
  PenLine,
  Zap,
  PawPrint,
  Wand2,
  Ship,
  Search,
  Cat,
  Bot,
  Trophy,
  Hourglass,
  Snowflake,
  Ghost,
  Car,
} from "lucide-react";
import { COLORS, FONTS } from "../../constants/theme";

const CreateStorySection = ({ formData, updateFormData }) => {
  // Added 1-3 and replaced 9+ with 9-14
  const ageGroups = [
    { id: "1-3", label: "1–3", sub: "YEARS", emoji: "🍼" },
    { id: "3-5", label: "3–5", sub: "YEARS", emoji: "🐣" },
    { id: "5-8", label: "5–8", sub: "YEARS", emoji: "🚀" },
    { id: "9-14", label: "9–14", sub: "YEARS", emoji: "🦁" },
  ];

  // Expanded to 16 total themes
  const themes = [
    {
      id: "space",
      label: "Space",
      icon: <Rocket size={20} />,
      emoji: "🚀",
      bg: "bg-blue-100",
      accent: "text-blue-500",
    },
    {
      id: "forest",
      label: "Jungle",
      icon: <TreeDeciduous size={20} />,
      emoji: "🌿",
      bg: "bg-green-100",
      accent: "text-green-500",
    },
    {
      id: "castle",
      label: "Fairytale",
      icon: <Castle size={20} />,
      emoji: "🏰",
      bg: "bg-pink-100",
      accent: "text-pink-500",
    },
    {
      id: "ocean",
      label: "Ocean",
      icon: <Waves size={20} />,
      emoji: "🌊",
      bg: "bg-cyan-100",
      accent: "text-cyan-500",
    },
    {
      id: "superhero",
      label: "Superhero",
      icon: <Zap size={20} />,
      emoji: "⚡",
      bg: "bg-yellow-100",
      accent: "text-yellow-500",
    },
    {
      id: "dinosaur",
      label: "Dinosaur",
      icon: <PawPrint size={20} />,
      emoji: "🦖",
      bg: "bg-emerald-100",
      accent: "text-emerald-500",
    },
    {
      id: "magic",
      label: "Magic",
      icon: <Wand2 size={20} />,
      emoji: "✨",
      bg: "bg-purple-100",
      accent: "text-purple-500",
    },
    {
      id: "pirate",
      label: "Pirate",
      icon: <Ship size={20} />,
      emoji: "🏴‍☠️",
      bg: "bg-stone-100",
      accent: "text-stone-500",
    },
    {
      id: "mystery",
      label: "Mystery",
      icon: <Search size={20} />,
      emoji: "🕵️",
      bg: "bg-indigo-100",
      accent: "text-indigo-500",
    },
    {
      id: "animal",
      label: "Animals",
      icon: <Cat size={20} />,
      emoji: "🐾",
      bg: "bg-orange-100",
      accent: "text-orange-500",
    },
    {
      id: "robot",
      label: "Robots",
      icon: <Bot size={20} />,
      emoji: "🤖",
      bg: "bg-slate-100",
      accent: "text-slate-500",
    },
    {
      id: "sports",
      label: "Sports",
      icon: <Trophy size={20} />,
      emoji: "🏆",
      bg: "bg-red-100",
      accent: "text-red-500",
    },
    {
      id: "history",
      label: "History",
      icon: <Hourglass size={20} />,
      emoji: "⏳",
      bg: "bg-amber-100",
      accent: "text-amber-700",
    },
    {
      id: "winter",
      label: "Winter",
      icon: <Snowflake size={20} />,
      emoji: "❄️",
      bg: "bg-sky-100",
      accent: "text-sky-500",
    },
    {
      id: "spooky",
      label: "Spooky",
      icon: <Ghost size={20} />,
      emoji: "👻",
      bg: "bg-fuchsia-100",
      accent: "text-fuchsia-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-7"
    >
      {/* Hero Name */}
      <div className="text-center">
        <label
          className={`block text-lg ${FONTS.heading} ${COLORS.text.main} mb-3`}
        >
          Who is the hero?
        </label>
        <div className="relative max-w-xs mx-auto">
          <input
            type="text"
            value={formData.heroName}
            onChange={(e) => updateFormData("heroName", e.target.value)}
            className="w-full bg-sky-50 hover:bg-sky-100 focus:bg-white text-center text-lg font-extrabold py-3 px-4 rounded-2xl outline-none border-2 border-sky-100 focus:border-blue-400 transition-all placeholder-blue-200 text-blue-900"
            placeholder="Name your hero..."
          />
          <PenLine
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* Age Selection */}
      <div className="text-center">
        <label
          className={`block text-lg ${FONTS.heading} ${COLORS.text.main} mb-3`}
        >
          How old are they?
        </label>
        {/* Added flex-wrap in case screen is small */}
        <div className="flex flex-wrap justify-center gap-4">
          {ageGroups.map((group) => (
            <motion.button
              key={group.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => updateFormData("ageGroup", group.id)}
              className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center border-2 transition-all duration-200 gap-1 ${
                formData.ageGroup === group.id
                  ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-200 scale-105"
                  : "bg-sky-50 border-sky-100 text-blue-300 hover:border-blue-200 hover:text-blue-500"
              }`}
            >
              <span className="text-2xl">{group.emoji}</span>
              <span className="text-base font-extrabold leading-none">
                {group.label}
              </span>
              <span className="text-[9px] font-bold tracking-widest uppercase opacity-70">
                {group.sub}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Theme Selection */}
      <div className="text-center">
        <label
          className={`block text-lg ${FONTS.heading} ${COLORS.text.main} mb-3`}
        >
          Pick a World
        </label>
        {/* Updated grid to be responsive and wider to accommodate 16 options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-2xl mx-auto">
          {themes.map((theme) => (
            <motion.button
              key={theme.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => updateFormData("theme", theme.id)}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-200 gap-1 ${
                formData.theme === theme.id
                  ? "bg-blue-500 border-blue-500 shadow-md shadow-blue-200 scale-105"
                  : "bg-sky-50 border-sky-100 hover:border-blue-200"
              }`}
            >
              <div
                className={`p-2 rounded-xl ${formData.theme === theme.id ? "bg-white/20 text-white" : `${theme.bg} ${theme.accent}`}`}
              >
                {theme.icon}
              </div>
              <span
                className={`text-xs font-extrabold ${formData.theme === theme.id ? "text-white" : "text-blue-700"}`}
              >
                {theme.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CreateStorySection;
