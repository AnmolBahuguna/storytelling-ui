import React from "react";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";

const CreateStorySection = ({ formData, updateFormData }) => {
  const ageGroups = [
    { id: "1-3", label: "1–3", sub: "YEARS", emoji: "🍼" },
    { id: "3-5", label: "3–5", sub: "YEARS", emoji: "🐣" },
    { id: "5-8", label: "5–8", sub: "YEARS", emoji: "🚀" },
    { id: "9-14", label: "9–14", sub: "YEARS", emoji: "🦁" },
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
        <label className="block text-lg font-bold text-slate-800 dark:text-white mb-3">
          Who is the hero?
        </label>
        <div className="relative max-w-xs mx-auto">
          <input
            type="text"
            value={formData.heroName}
            onChange={(e) => updateFormData("heroName", e.target.value)}
            className="w-full bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-900 text-center text-lg font-extrabold py-3 px-4 rounded-2xl outline-none border-2 border-sky-100 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-500 transition-all placeholder-blue-200 dark:placeholder-slate-500 text-blue-900 dark:text-white"
            placeholder="Name your hero..."
          />
          <PenLine
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 dark:text-slate-500 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* Age Selection */}
      <div className="text-center">
        <label className="block text-lg font-bold text-slate-800 dark:text-white mb-3">
          How old are they?
        </label>
        <div className="flex flex-wrap justify-center gap-4">
          {ageGroups.map((group) => (
            <motion.button
              key={group.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => updateFormData("ageGroup", group.id)}
              className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center border-2 transition-all duration-200 gap-1 ${
                formData.ageGroup === group.id
                  ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/50 scale-105"
                  : "bg-sky-50 dark:bg-slate-800 border-sky-100 dark:border-slate-700 text-blue-400 dark:text-slate-400 hover:border-blue-200 dark:hover:border-slate-500 hover:text-blue-500 dark:hover:text-slate-200"
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

      {/* Duration */}
      <div className="text-center">
        <label className="block text-lg font-bold text-slate-800 dark:text-white mb-3">
          How long?
        </label>
        <div className="flex justify-center gap-3">
          {[
            { id: "short", label: "Short", emoji: "⏱️" },
            { id: "medium", label: "Medium", emoji: "⏳" },
            { id: "long", label: "Long", emoji: "🕰️" },
          ].map((dur) => (
            <motion.button
              key={dur.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => updateFormData("duration", dur.id)}
              className={`px-5 py-3 rounded-2xl font-extrabold text-sm transition-all border-2 flex items-center gap-1.5 ${
                formData.duration === dur.id
                  ? "bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/50"
                  : "bg-sky-50 dark:bg-slate-800 border-sky-100 dark:border-slate-700 text-blue-500 dark:text-slate-400 hover:border-blue-200 dark:hover:border-slate-500"
              }`}
            >
              <span>{dur.emoji}</span> {dur.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CreateStorySection;
