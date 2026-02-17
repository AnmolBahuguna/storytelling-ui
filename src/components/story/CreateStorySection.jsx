import React from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  TreeDeciduous,
  Waves,
  Castle,
  Sparkles,
  PenLine,
} from "lucide-react";
import { COLORS, STYLES, FONTS } from "../../constants/theme";

const CreateStorySection = ({ formData, updateFormData }) => {
  const ageGroups = [
    { id: "3-5", label: "3-5", sub: "YEARS" },
    { id: "5-8", label: "6-8", sub: "YEARS" },
    { id: "9+", label: "9+", sub: "YEARS" },
  ];

  const themes = [
    {
      id: "space",
      label: "Space",
      icon: <Rocket size={18} />,
      bg: "bg-blue-50",
    },
    {
      id: "forest",
      label: "Jungle",
      icon: <TreeDeciduous size={18} />,
      bg: "bg-green-50",
    },
    {
      id: "castle",
      label: "Fairytale",
      icon: <Castle size={18} />,
      bg: "bg-pink-50",
    },
    {
      id: "ocean",
      label: "Ocean",
      icon: <Waves size={18} />,
      bg: "bg-cyan-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full justify-center gap-[2vh]"
    >
      {/* Hero Name Input */}
      <div className="space-y-[1vh] text-center w-full">
        <label
          className={`block text-[2vh] ${FONTS.heading} ${COLORS.text.main}`}
        >
          Who is the hero?
        </label>
        <div className="relative max-w-[80%] mx-auto w-full">
          <input
            type="text"
            value={formData.heroName}
            onChange={(e) => updateFormData("heroName", e.target.value)}
            className={`w-full ${COLORS.background.input} hover:bg-gray-50 focus:${COLORS.background.card} text-center text-[2.2vh] font-bold py-[1.5vh] px-[2vw] rounded-2xl outline-none border-2 border-transparent ${COLORS.border.focus} transition-all ${COLORS.text.placeholder}`}
            placeholder="Name of the hero..."
          />
          <PenLine
            className="absolute right-[1vw] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* Age Selection */}
      <div className="space-y-[1vh] text-center w-full">
        <label
          className={`block text-[2vh] ${FONTS.heading} ${COLORS.text.main}`}
        >
          How old are they?
        </label>
        <div className="flex justify-center gap-[1vw] w-full">
          {ageGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => updateFormData("ageGroup", group.id)}
              className={`w-[9vh] h-[9vh] rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-200 ${
                formData.ageGroup === group.id
                  ? `${COLORS.primary.DEFAULT} ${COLORS.primary.border} text-black shadow-md scale-105`
                  : `${COLORS.background.card} ${COLORS.border.default} text-gray-400 hover:border-gray-300 hover:text-gray-600`
              }`}
            >
              <span className="text-[2.2vh] font-bold">{group.label}</span>
              <span className="text-[0.9vh] font-bold tracking-widest uppercase opacity-60">
                {group.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Selection */}
      <div className="space-y-[1vh] text-center w-full">
        <label
          className={`block text-[2vh] ${FONTS.heading} ${COLORS.text.main}`}
        >
          Pick a World
        </label>
        <div className="grid grid-cols-4 gap-[1vw] w-full max-w-[90%] mx-auto">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => updateFormData("theme", theme.id)}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-200 gap-[0.5vh] ${
                formData.theme === theme.id
                  ? `${COLORS.primary.DEFAULT} ${COLORS.primary.border} shadow-sm ring-1 ring-yellow-400`
                  : `${COLORS.background.card} ${COLORS.border.default} hover:border-gray-300 hover:shadow-sm`
              }`}
            >
              <div
                className={`p-[1vh] rounded-full ${formData.theme === theme.id ? "bg-black/10 text-black" : `${theme.bg} text-gray-600`}`}
              >
                {theme.icon}
              </div>
              <span
                className={`text-[1.3vh] font-bold ${formData.theme === theme.id ? "text-black" : "text-gray-600"}`}
              >
                {theme.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CreateStorySection;
