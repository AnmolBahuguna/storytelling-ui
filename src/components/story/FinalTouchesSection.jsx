import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Search, Globe } from "lucide-react";

const FinalTouchesSection = ({ formData, updateFormData }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const languages = [
    { id: "English", native: "English", flag: "🇬🇧", category: "global" },
    { id: "Hindi", native: "हिन्दी", flag: "🇮🇳", category: "indian" },
    { id: "Spanish", native: "Español", flag: "🇪🇸", category: "global" },
    { id: "French", native: "Français", flag: "🇫🇷", category: "global" },
    { id: "German", native: "Deutsch", flag: "🇩🇪", category: "global" },
    { id: "Italian", native: "Italiano", flag: "🇮🇹", category: "global" },
    { id: "Japanese", native: "日本語", flag: "🇯🇵", category: "global" },
    { id: "Chinese", native: "中文", flag: "🇨🇳", category: "global" },
    { id: "Korean", native: "한국어", flag: "🇰🇷", category: "global" },
    { id: "Portuguese", native: "Português", flag: "🇵🇹", category: "global" },
    { id: "Russian", native: "Русский", flag: "🇷🇺", category: "global" },
    { id: "Arabic", native: "العربية", flag: "🇸🇦", category: "global" },
    { id: "Bengali", native: "বাংলা", flag: "🇮🇳", category: "indian" },
    { id: "Marathi", native: "मराठी", flag: "🇮🇳", category: "indian" },
    { id: "Telugu", native: "తెలుగు", flag: "🇮🇳", category: "indian" },
    { id: "Tamil", native: "தமிழ்", flag: "🇮🇳", category: "indian" },
    { id: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳", category: "indian" },
    { id: "Punjabi", native: "ਪੰਜਾਬੀ", flag: "🇮🇳", category: "indian" },
    { id: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳", category: "indian" },
    { id: "Malayalam", native: "മലയാളം", flag: "🇮🇳", category: "indian" },
    { id: "Odia", native: "ଓଡ଼ିଆ", flag: "🇮🇳", category: "indian" },
    { id: "Turkish", native: "Türkçe", flag: "🇹🇷", category: "global" },
  ];

  const themeEmojis = {
    space: "🚀",
    forest: "🌿",
    castle: "🏰",
    ocean: "🌊",
    superhero: "⚡",
    magic: "🪄",
    mystery: "🔍",
    animal: "🐾",
    robot: "🤖",
    sports: "🏆",
    history: "📜",
    winter: "❄️",
  };

  const subjectBadges = {
    maths: { label: "Maths Wizard 🔢", color: "text-blue-500 dark:text-blue-400" },
    science: { label: "Science Explorer 🔬", color: "text-emerald-500 dark:text-emerald-400" },
    history: { label: "History Explorer 📜", color: "text-amber-500 dark:text-amber-400" },
    creative: { label: "Creative Story ✨", color: "text-purple-500 dark:text-purple-400" },
  };

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSubjectInfo = subjectBadges[formData.subject] || subjectBadges["maths"];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6"
    >
      {/* LANGUAGE SELECTOR */}
      <div>
        <div className="text-center mb-3">
          <label className="block text-lg font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
            <Globe className="text-violet-500" size={20} /> Choose Language ({languages.length}+ Supported)
          </label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            The story and audio narration will be generated in your chosen language.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative max-w-xs mx-auto mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search language..."
            className="w-full bg-amber-50/50 dark:bg-slate-800 text-xs font-semibold py-2 pl-9 pr-3 rounded-xl border border-amber-100 dark:border-slate-700 focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 text-slate-800 dark:text-white placeholder-slate-400"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Languages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1 pr-2 custom-scrollbar">
          {filteredLanguages.map((lang) => {
            const isSelected = formData.language === lang.id;
            return (
              <motion.button
                key={lang.id}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => updateFormData("language", lang.id)}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-between border-2 transition-all text-left ${
                  isSelected
                    ? "bg-violet-500 border-violet-500 shadow-md shadow-violet-200 dark:shadow-violet-900/50 text-white"
                    : "bg-amber-50/50 dark:bg-slate-800 border-amber-100 dark:border-slate-700 hover:border-violet-200 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-lg shrink-0">{lang.flag}</span>
                  <div className="flex flex-col truncate">
                    <span
                      className={`font-bold text-xs truncate ${
                        isSelected ? "text-white" : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {lang.id}
                    </span>
                    <span
                      className={`text-[10px] truncate ${
                        isSelected ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {lang.native}
                    </span>
                  </div>
                </div>
                  {isSelected && (
                  <div className="bg-white/30 rounded-full p-0.5 shrink-0 ml-1">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* STORY SUMMARY CARD */}
      <div className="bg-gradient-to-br from-violet-50 to-amber-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-5 border-2 border-violet-100 dark:border-slate-700 text-center transition-colors shadow-sm">
        <span className="text-violet-500 dark:text-violet-400 text-xs font-black tracking-widest uppercase block mb-2">
          🎉 Story Overview
        </span>
        <p className="text-slate-800 dark:text-slate-200 font-bold text-sm md:text-base leading-relaxed">
          A{" "}
          <span className="text-violet-600 dark:text-violet-400 font-extrabold">
            {formData.duration}
          </span>{" "}
          {themeEmojis[formData.theme] || "✨"} story about{" "}
          <span className="text-violet-600 dark:text-violet-400 font-extrabold">
            {formData.heroName || "your hero"}
          </span>{" "}
          ({formData.ageGroup} yrs) exploring{" "}
          <span className="text-violet-600 dark:text-violet-400 font-extrabold capitalize">
            {formData.theme}
          </span>
          !
        </p>

        {/* Learning Focus & Language Highlights */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <div className="px-3 py-1 rounded-full bg-violet-100/70 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold flex items-center gap-1.5 border border-violet-200 dark:border-violet-800">
            <span>Learning:</span>
            <span className="font-extrabold">{selectedSubjectInfo.label}</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
            <span>Language:</span>
            <span className="font-extrabold">{formData.language}</span>
          </div>
        </div>

        {formData.locationName && (
          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs mt-2">
            📍 Starting at: {formData.locationName}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default FinalTouchesSection;
