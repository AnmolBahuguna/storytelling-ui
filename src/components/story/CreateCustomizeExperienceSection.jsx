import React from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  TreeDeciduous,
  Waves,
  Castle,
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

const CustomizeExperienceSection = ({ formData, updateFormData }) => {
  // Expanded to 16 total themes (Moved from Step 1)
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
      id: "magic",
      label: "Magic",
      icon: <Wand2 size={20} />,
      emoji: "✨",
      bg: "bg-purple-100",
      accent: "text-purple-500",
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
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-7"
    >
      {/* Theme Selection */}
      <div className="text-center">
        <label
          className={`block text-lg ${FONTS.heading} ${COLORS.text.main} mb-3`}
        >
          Pick a World
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 max-w-md mx-auto">
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

export default CustomizeExperienceSection;
