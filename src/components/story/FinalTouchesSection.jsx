import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { COLORS, FONTS } from "../../constants/theme";

const FinalTouchesSection = ({ formData, updateFormData }) => {
  const languages = [
    { id: "English", flag: "🇬🇧" },
    { id: "Hindi",   flag: "🇮🇳" },
    { id: "Spanish", flag: "🇪🇸" },
    { id: "French",  flag: "🇫🇷" },
  ];

  const themeEmojis = {
    space: "🚀", forest: "🌿", castle: "🏰", ocean: "🌊",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-7"
    >
      {/* Language Selection */}
      <div className="text-center">
        <label className={`block text-lg ${FONTS.heading} ${COLORS.text.main} mb-3`}>
          🌐 Choose Language
        </label>
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          {languages.map((lang) => (
            <motion.button
              key={lang.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => updateFormData("language", lang.id)}
              className={`py-3 px-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                formData.language === lang.id
                  ? "bg-blue-500 border-blue-500 shadow-md shadow-blue-200"
                  : "bg-sky-50 border-sky-100 hover:border-blue-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{lang.flag}</span>
                <span className={`font-extrabold text-sm ${formData.language === lang.id ? "text-white" : "text-blue-700"}`}>
                  {lang.id}
                </span>
              </div>
              {formData.language === lang.id && (
                <div className="bg-white/30 rounded-full p-0.5">
                  <Check size={13} className="text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Story Summary */}
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl p-5 border-2 border-sky-100 text-center">
        <span className="text-blue-400 text-xs font-extrabold tracking-widest uppercase block mb-2">
          🎉 Your Story
        </span>
        <p className="text-blue-900 font-bold text-base leading-relaxed">
          A{" "}
          <span className="text-blue-600 font-extrabold">{formData.duration}</span>{" "}
          {themeEmojis[formData.theme] || "✨"} story about{" "}
          <span className="text-blue-600 font-extrabold">{formData.heroName || "your hero"}</span>{" "}
          ({formData.ageGroup} yrs) exploring{" "}
          <span className="text-blue-600 font-extrabold capitalize">{formData.theme}</span>!
        </p>
        {formData.locationName && (
          <p className="text-blue-400 font-bold text-sm mt-1">
            📍 Starting at: {formData.locationName}
          </p>
        )}
      </div>

      {/* Fun ready message */}
      <div className="text-center">
        <p className="text-blue-400 font-extrabold text-sm animate-pulse">
          ✨ Ready to create some magic? Hit the button below! ✨
        </p>
      </div>
    </motion.div>
  );
};

export default FinalTouchesSection;