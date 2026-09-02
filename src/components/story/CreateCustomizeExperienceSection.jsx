import React from "react";
import { motion } from "framer-motion";
import { Calculator, FlaskConical, Landmark, Sparkles, CheckCircle2 } from "lucide-react";

const CustomizeExperienceSection = ({ formData, updateFormData }) => {
  const subjects = [
    {
      id: "maths",
      title: "Maths Wizard",
      emoji: "🔢",
      icon: Calculator,
      badge: "Addition & Subtraction",
      desc: "Solve fun counting, addition, subtraction & shape puzzles on the adventure!",
    },
    {
      id: "science",
      title: "Science Explorer",
      emoji: "🔬",
      icon: FlaskConical,
      badge: "Space & Nature",
      desc: "Discover gravity, the solar system, animals, plants & simple experiments!",
    },
    {
      id: "history",
      title: "History Time-Travel",
      emoji: "📜",
      icon: Landmark,
      badge: "Ancient Worlds",
      desc: "Travel back to ancient Egypt, dinosaurs, castles & famous inventors!",
    },
    {
      id: "creative",
      title: "Creative Tale",
      emoji: "✨",
      icon: Sparkles,
      badge: "Values & Fun",
      desc: "Classic adventures celebrating teamwork, kindness, and big dreams!",
    },
    {
      id: "general",
      title: "Just for Fun",
      emoji: "🎈",
      icon: Sparkles,
      badge: "No Specific Subject",
      desc: "Just a pure, fun story adventure with no explicit educational focus.",
    },
  ];

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

  const selectedSubject = formData.subject || "maths";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-8"
    >
      {/* 1. LEARNING FOCUS / SUBJECT SELECTOR */}
      <div>
        <div className="text-center mb-4">
          <label className="block text-xl font-black text-slate-800 dark:text-white uppercase tracking-wider">
            🎓 Choose Learning Focus
          </label>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pick what your child will learn and explore during this adventure!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {subjects.map((sub) => {
            const isSelected = selectedSubject === sub.id;
            return (
              <motion.button
                key={sub.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => updateFormData("subject", sub.id)}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? "border-violet-500 bg-violet-50/70 dark:bg-violet-950/40 shadow-lg shadow-violet-500/10 ring-2 ring-violet-500/30"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{sub.emoji}</span>
                    <div>
                      <h4 className="font-extrabold text-sm md:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                        {sub.title}
                      </h4>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mt-0.5">
                        {sub.badge}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 size={18} className="text-violet-500 shrink-0 mt-0.5" />
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sub.desc}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-200 dark:bg-slate-800 w-full" />

      {/* 2. PICK A WORLD */}
      <div className="text-center">
        <label className="block text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-wider">
          🗺️ Pick a World
        </label>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-4">
          Where will the learning adventure take place?
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 max-w-3xl mx-auto">
          {themes.map((theme) => (
            <motion.button
              key={theme.id}
              type="button"
              whileTap={{ scale: 0.93 }}
              onClick={() => updateFormData("theme", theme.id)}
              className={`group relative overflow-hidden aspect-square rounded-2xl flex flex-col items-center justify-end border-[3px] transition-all duration-300 ${
                formData.theme === theme.id
                  ? "border-violet-500 shadow-xl shadow-violet-500/40 scale-[1.03] z-10"
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
                    ? "bg-gradient-to-t from-violet-900/90 via-violet-900/40 to-transparent"
                    : "bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90"
                }`}
              />

              {/* Selection Ring */}
              {formData.theme === theme.id && (
                <div className="absolute inset-0 border-[4px] border-white/20 rounded-xl" />
              )}

              <div className="relative z-10 w-full p-2.5 backdrop-blur-sm bg-black/20 border-t border-white/10 flex items-center justify-center">
                <span
                  className={`text-xs sm:text-sm font-black tracking-wider uppercase transition-colors duration-300 ${
                    formData.theme === theme.id
                      ? "text-violet-100 drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]"
                      : "text-white group-hover:text-amber-300"
                  }`}
                >
                  {theme.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-200 dark:bg-slate-800 w-full" />

      {/* 3. EXTRA DETAILS */}
      <div className="text-center max-w-3xl mx-auto w-full px-2">
        <label className="block text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-wider">
          📝 Extra Story Details
        </label>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-4">
          Add any specific characters, lessons, or ideas you want included in the story! (Optional)
        </p>
        <textarea
          value={formData.extraDetails || ""}
          onChange={(e) => updateFormData("extraDetails", e.target.value)}
          placeholder="e.g. The hero has a pet dragon named Sparky and learns to share his toys..."
          className="w-full p-4 bg-white dark:bg-slate-900/60 border-2 border-slate-200 dark:border-slate-800 rounded-2xl resize-none h-28 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 transition-all"
        />
      </div>
    </motion.div>
  );
};

export default CustomizeExperienceSection;
