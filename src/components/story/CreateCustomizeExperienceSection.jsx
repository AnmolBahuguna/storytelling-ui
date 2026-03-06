import React from "react";
import { motion } from "framer-motion";
import { BookOpenText, Volume2, MapPin } from "lucide-react";
import { COLORS, FONTS } from "../../constants/theme";

const CustomizeExperienceSection = ({ formData, updateFormData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-7"
    >
      {/* Location Input */}
      <div className="text-center">
        <label
          className={`block text-lg ${FONTS.heading} ${COLORS.text.main} mb-3`}
        >
          Where does it start?
        </label>
        <div className="relative max-w-xs mx-auto">
          <input
            type="text"
            value={formData.locationName}
            onChange={(e) => updateFormData("locationName", e.target.value)}
            className="w-full bg-sky-50 hover:bg-sky-100 focus:bg-white text-center text-lg font-extrabold py-3 pl-4 pr-10 rounded-2xl outline-none border-2 border-sky-100 focus:border-blue-400 transition-all placeholder-blue-200 text-blue-900"
            placeholder="e.g. The Moon Base"
          />
          <MapPin
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* Reading Mode */}
      <div className="text-center">
        <label
          className={`block text-lg ${FONTS.heading} ${COLORS.text.main} mb-3`}
        >
          How do you want to enjoy it?
        </label>
        <div className="flex justify-center gap-4">
          {[
            {
              id: "read",
              icon: <BookOpenText size={30} />,
              label: "I'll Read",
              emoji: "📚",
            },
            {
              id: "listen",
              icon: <Volume2 size={30} />,
              label: "Read to Me",
              emoji: "🔊",
            },
          ].map((opt) => (
            <motion.button
              key={opt.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => updateFormData("mediaType", opt.id)}
              className={`w-36 h-32 rounded-3xl flex flex-col items-center justify-center border-2 transition-all duration-200 gap-2 ${
                formData.mediaType === opt.id
                  ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-200 scale-105"
                  : "bg-sky-50 border-sky-100 text-blue-400 hover:border-blue-200"
              }`}
            >
              <span className="text-3xl">{opt.emoji}</span>
              <span className="font-extrabold text-sm">{opt.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="text-center">
        <label
          className={`block text-lg ${FONTS.heading} ${COLORS.text.main} mb-3`}
        >
          How long?
        </label>
        <div className="flex justify-center gap-3">
          {[
            { id: "short", label: "Short" },
            { id: "medium", label: "Medium" },
            { id: "long", label: "Long" },
          ].map((dur) => (
            <motion.button
              key={dur.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => updateFormData("duration", dur.id)}
              className={`px-5 py-3 rounded-2xl font-extrabold text-sm transition-all border-2 flex items-center gap-1.5 ${
                formData.duration === dur.id
                  ? "bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200"
                  : "bg-sky-50 border-sky-100 text-blue-500 hover:border-blue-200"
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

export default CustomizeExperienceSection;
