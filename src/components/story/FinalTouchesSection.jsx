import React from "react";
import { motion } from "framer-motion";
import { Check, MapPin } from "lucide-react";
import { COLORS, FONTS } from "../../constants/theme";

const FinalTouchesSection = ({ formData, updateFormData }) => {
  const languages = [
    { id: "English", flag: "🇬🇧" },
    { id: "Hindi", flag: "🇮🇳" },
    { id: "Spanish", flag: "🇪🇸" },
    { id: "French", flag: "🇫🇷" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full justify-between py-[1vh]"
    >
      <div className="flex-1 flex flex-col justify-center gap-[3vh]">
        {/* Language Selection */}
        <div className="space-y-[1.5vh] text-center w-full">
          <label
            className={`block text-[2vh] ${FONTS.heading} ${COLORS.text.main}`}
          >
            Choose Language
          </label>
          <div className="grid grid-cols-2 gap-[1.5vh] w-full">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => updateFormData("language", lang.id)}
                className={`py-[2vh] px-[2vw] rounded-2xl flex items-center justify-between border-2 transition-all ${
                  formData.language === lang.id
                    ? `${COLORS.background.main} ${COLORS.primary.border} shadow-sm`
                    : `${COLORS.background.card} ${COLORS.border.default} hover:border-gray-300`
                }`}
              >
                <div className="flex items-center gap-[1vh]">
                  <span className="text-[2.2vh]">{lang.flag}</span>
                  <span
                    className={`font-bold text-[1.6vh] ${formData.language === lang.id ? "text-black" : "text-gray-500"}`}
                  >
                    {lang.id}
                  </span>
                </div>
                {formData.language === lang.id && (
                  <div
                    className={`${COLORS.primary.DEFAULT} rounded-full p-[0.3vh]`}
                  >
                    <Check size={12} className="text-black" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Review - Compact */}
        <div
          className={`bg-gray-50 rounded-2xl p-[2.5vh] border ${COLORS.border.default} text-center`}
        >
          <span className="text-gray-400 text-[1.2vh] font-bold tracking-widest uppercase mb-[0.5vh] block">
            Story Summary
          </span>
          <p
            className={`text-[1.8vh] ${COLORS.text.main} font-medium leading-relaxed`}
          >
            A <span className="text-black font-bold">{formData.duration}</span>{" "}
            story about{" "}
            <span className="text-black font-bold">{formData.heroName}</span> (
            {formData.ageGroup}) exploring{" "}
            <span className="text-black font-bold">{formData.theme}</span>.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FinalTouchesSection;
