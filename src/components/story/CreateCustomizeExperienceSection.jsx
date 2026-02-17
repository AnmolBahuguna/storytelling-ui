import React from "react";
import { motion } from "framer-motion";
import { BookOpenText, Volume2, Clock, MapPin } from "lucide-react";
import { COLORS, FONTS } from "../../constants/theme";

const CustomizeExperienceSection = ({ formData, updateFormData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col h-full justify-center gap-[3vh]"
    >
      {/* Location Input */}
      <div className="space-y-[1vh] text-center w-full">
        <label
          className={`block text-[2vh] ${FONTS.heading} ${COLORS.text.main}`}
        >
          Where does it start?
        </label>
        <div className="relative max-w-[80%] mx-auto w-full">
          <input
            type="text"
            value={formData.locationName}
            onChange={(e) => updateFormData("locationName", e.target.value)}
            className={`w-full ${COLORS.background.input} hover:bg-gray-50 focus:${COLORS.background.card} text-center text-[2vh] font-bold py-[1.5vh] px-[2vw] rounded-2xl outline-none border-2 border-transparent ${COLORS.border.focus} transition-all ${COLORS.text.placeholder}`}
            placeholder="e.g. The Moon Base"
          />
          <MapPin
            className="absolute left-[1vw] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* Reading Mode */}
      <div className="space-y-[1vh] text-center w-full">
        <label
          className={`block text-[2vh] ${FONTS.heading} ${COLORS.text.main}`}
        >
          How do you want to read?
        </label>
        <div className="flex justify-center gap-[1.5vw] w-full">
          <button
            onClick={() => updateFormData("mediaType", "read")}
            className={`w-[14vh] h-[14vh] rounded-3xl flex flex-col items-center justify-center border-2 transition-all duration-200 gap-[1vh] ${
              formData.mediaType === "read"
                ? `${COLORS.primary.DEFAULT} ${COLORS.primary.border} text-black shadow-md`
                : `${COLORS.background.card} ${COLORS.border.default} text-gray-400 hover:border-gray-300`
            }`}
          >
            <BookOpenText size={28} />
            <span className="font-bold text-[1.6vh]">I'll Read</span>
          </button>
          <button
            onClick={() => updateFormData("mediaType", "listen")}
            className={`w-[14vh] h-[14vh] rounded-3xl flex flex-col items-center justify-center border-2 transition-all duration-200 gap-[1vh] ${
              formData.mediaType === "listen"
                ? `${COLORS.primary.DEFAULT} ${COLORS.primary.border} text-black shadow-md`
                : `${COLORS.background.card} ${COLORS.border.default} text-gray-400 hover:border-gray-300`
            }`}
          >
            <Volume2 size={28} />
            <span className="font-bold text-[1.6vh]">Read to Me</span>
          </button>
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-[1vh] text-center w-full">
        <label
          className={`block text-[2vh] ${FONTS.heading} ${COLORS.text.main}`}
        >
          Story Length
        </label>
        <div className="flex justify-center gap-[1vw] w-full">
          {["short", "medium", "long"].map((dur) => (
            <button
              key={dur}
              onClick={() => updateFormData("duration", dur)}
              className={`px-[2.5vw] py-[1.2vh] rounded-xl font-bold capitalize text-[1.5vh] transition-all border-2 ${
                formData.duration === dur
                  ? "bg-black border-black text-white shadow-md"
                  : `${COLORS.background.input} border-transparent text-gray-500 hover:bg-gray-200`
              }`}
            >
              {dur}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CustomizeExperienceSection;
