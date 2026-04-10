import React from "react";
import { motion } from "framer-motion";

const CustomizeExperienceSection = ({ formData, updateFormData }) => {
  const themes = [
    { id: "space", label: "Space", image: "/themes/space.png" },
    { id: "forest", label: "Jungle", image: "/themes/forest.png" },
    { id: "castle", label: "Fairytale", image: "/themes/castle.png" },
    { id: "ocean", label: "Ocean", image: "/themes/ocean.png" },
    { id: "superhero", label: "Superhero", image: "/themes/superhero.png" },
    { id: "magic", label: "Magic", image: "/themes/magic.png" },
    { id: "mystery", label: "Mystery", image: "/themes/mystery.png" },
    { id: "animal", label: "Animals", image: "/themes/animal.png" },
    { id: "robot", label: "Robots", image: "/themes/robot.png" },
    { id: "sports", label: "Sports", image: "/themes/sports.png" },
    { id: "history", label: "History", image: "/themes/history.png" },
    { id: "winter", label: "Winter", image: "/themes/winter.png" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-7"
    >
      <div className="text-center">
        <label className="block text-xl font-black text-slate-800 dark:text-white mb-5 uppercase tracking-wider">
          Pick a World
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 max-w-3xl mx-auto px-4">
          {themes.map((theme) => (
            <motion.button
              key={theme.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => updateFormData("theme", theme.id)}
              className={`group relative overflow-hidden aspect-square rounded-2xl flex flex-col items-center justify-end border-[3px] transition-all duration-300 ${
                formData.theme === theme.id
                  ? "border-blue-500 shadow-xl shadow-blue-500/40 scale-[1.03] z-10"
                  : "border-transparent shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              <img 
                src={theme.image} 
                alt={theme.label} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
              />
              {/* Dynamic Gradient Overlay */}
              <div 
                className={`absolute inset-0 transition-opacity duration-300 ${
                  formData.theme === theme.id 
                    ? "bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent" 
                    : "bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90"
                }`} 
              />
              
              {/* Selection Ring */}
              {formData.theme === theme.id && (
                 <div className="absolute inset-0 border-[4px] border-white/20 rounded-xl" />
              )}
              
              <div className="relative z-10 w-full p-3 backdrop-blur-sm bg-black/20 border-t border-white/10 flex items-center justify-center">
                 <span className={`text-sm sm:text-base font-black tracking-wider uppercase transition-colors duration-300 ${
                   formData.theme === theme.id 
                    ? "text-blue-100 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" 
                    : "text-white group-hover:text-amber-300"
                 }`}>
                   {theme.label}
                 </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CustomizeExperienceSection;
