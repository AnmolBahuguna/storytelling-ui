import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Rocket,
  TreeDeciduous,
  Waves,
  Castle,
  Sparkles,
  BookOpen,
  Wand2,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import Particles from "../components/ui/Particles";

const CreateStory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    heroName: "",
    age: "",
    theme: "space", // Default selection
    lesson: "",
  });

  // Updated Adventure Options
  const adventureOptions = [
    { id: "space", label: "Space", icon: <Rocket size={20} /> },
    { id: "forest", label: "Forest", icon: <TreeDeciduous size={20} /> },
    { id: "ocean", label: "Ocean", icon: <Waves size={20} /> },
    { id: "castle", label: "Castle", icon: <Castle size={20} /> },
    { id: "other", label: "Surprise", icon: <Sparkles size={20} /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThemeSelect = (themeId) => {
    setFormData((prev) => ({ ...prev, theme: themeId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // --- REAL API CALL ---
    const generateStory = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/generate-story",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          },
        );

        const data = await response.json();

        if (data.success) {
          // Navigate to viewer and pass the generated story data
          navigate("/story-view", { state: { story: data.story } });
        } else {
          alert("Error generating story: " + data.message);
        }
      } catch (error) {
        console.error("Connection Error:", error);
        alert(
          "Failed to connect to the server. Is the backend running on port 5000?",
        );
      } finally {
        setLoading(false);
      }
    };

    generateStory();
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Theme Configuration
  const theme = {
    bg: isDarkMode ? "bg-[#020205]" : "bg-[#f8fafc]",
    textMain: isDarkMode ? "text-white" : "text-slate-900",
    textSub: isDarkMode ? "text-slate-400" : "text-slate-500",
    cardBg: isDarkMode ? "bg-white/5" : "bg-white/80",
    cardBorder: isDarkMode ? "border-white/10" : "border-slate-200",
    shadow: isDarkMode ? "shadow-[0_0_50px_rgba(0,0,0,0.6)]" : "shadow-xl",
    headerBg: isDarkMode ? "bg-black/40" : "bg-slate-50/50",
    headerBorder: isDarkMode ? "border-white/5" : "border-slate-100",
    inputBg: isDarkMode ? "bg-black/40" : "bg-white",
    inputBorder: isDarkMode ? "border-slate-800" : "border-slate-200",
    inputText: isDarkMode ? "text-white" : "text-slate-900",
    inputPlaceholder: isDarkMode
      ? "placeholder-slate-600"
      : "placeholder-slate-400",
    particleColors: isDarkMode
      ? ["#ffffff", "#94a3b8"]
      : ["#0f172a", "#334155"], // White vs Dark Slate
    iconColor: isDarkMode ? "text-slate-500" : "text-slate-400",
  };

  return (
    <div
      className={`relative w-full min-h-screen ${theme.bg} overflow-y-auto overflow-x-hidden flex items-center justify-center font-sans py-12 px-4 transition-colors duration-500`}
    >
      {/* --- Theme Toggle Button --- */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 ${
          isDarkMode
            ? "bg-white/10 text-yellow-300 hover:bg-white/20 shadow-lg border border-white/5"
            : "bg-white text-slate-600 hover:bg-slate-50 shadow-md border border-slate-200"
        }`}
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* --- Background: Particles Effect --- */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <Particles
          particleColors={theme.particleColors}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={3}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* --- Main Card --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl"
      >
        <div
          className={`${theme.cardBg} backdrop-blur-2xl border ${theme.cardBorder} rounded-3xl ${theme.shadow} overflow-hidden transition-all duration-500`}
        >
          {/* Header Section */}
          <div
            className={`${theme.headerBg} p-8 border-b ${theme.headerBorder} flex flex-col items-center justify-center text-center transition-colors duration-500`}
          >
            <div className="p-3 bg-blue-600/20 rounded-full mb-4">
              <BookOpen className="text-blue-500" size={32} />
            </div>
            <h1
              className={`text-3xl font-bold ${theme.textMain} tracking-tight transition-colors duration-300`}
            >
              Craft Your Adventure
            </h1>
            <p
              className={`${theme.textSub} mt-2 text-sm max-w-md transition-colors duration-300`}
            >
              Configure the parameters below to generate a unique, AI-powered
              bedtime story.
            </p>
          </div>

          <div className="p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Row 1: Hero Details (Grid Layout) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hero Name */}
                <div className="space-y-1.5">
                  <label
                    className={`text-xs font-semibold ${theme.textSub} uppercase tracking-wider ml-1 transition-colors duration-300`}
                  >
                    Hero Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User
                        className={`h-4 w-4 ${theme.iconColor} group-focus-within:text-blue-500 transition-colors`}
                      />
                    </div>
                    <input
                      type="text"
                      name="heroName"
                      value={formData.heroName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Aarav"
                      className={`block w-full pl-10 pr-4 py-3 ${theme.inputBg} border ${theme.inputBorder} rounded-xl ${theme.inputText} ${theme.inputPlaceholder} focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all text-sm duration-300`}
                    />
                  </div>
                </div>

                {/* Hero Age */}
                <div className="space-y-1.5">
                  <label
                    className={`text-xs font-semibold ${theme.textSub} uppercase tracking-wider ml-1 transition-colors duration-300`}
                  >
                    Age
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar
                        className={`h-4 w-4 ${theme.iconColor} group-focus-within:text-blue-500 transition-colors`}
                      />
                    </div>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="16"
                      placeholder="e.g. 7"
                      className={`block w-full pl-10 pr-4 py-3 ${theme.inputBg} border ${theme.inputBorder} rounded-xl ${theme.inputText} ${theme.inputPlaceholder} focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all text-sm duration-300`}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Adventure Type Selection */}
              <div className="space-y-3">
                <label
                  className={`text-xs font-semibold ${theme.textSub} uppercase tracking-wider ml-1 transition-colors duration-300`}
                >
                  Select Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {adventureOptions.map((option) => {
                    const isSelected = formData.theme === option.id;
                    // Dynamic classes for options based on selection and theme
                    const optionBaseClass = isDarkMode
                      ? "bg-black/40 border-slate-800 text-slate-500 hover:bg-white/5 hover:border-slate-600 hover:text-slate-300"
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-blue-300 hover:text-slate-700";

                    const optionSelectedClass = isDarkMode
                      ? "bg-blue-600/20 border-blue-500/50 text-blue-100 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                      : "bg-blue-50 border-blue-500 text-blue-700 shadow-sm";

                    return (
                      <motion.button
                        key={option.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleThemeSelect(option.id)}
                        className={`
                          relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200
                          ${isSelected ? optionSelectedClass : optionBaseClass}
                        `}
                      >
                        <div
                          className={`mb-2 ${isSelected ? "text-blue-500" : theme.iconColor}`}
                        >
                          {option.icon}
                        </div>
                        <span className="text-xs font-medium">
                          {option.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: The Secret Lesson */}
              <div className="space-y-1.5">
                <label
                  className={`text-xs font-semibold ${theme.textSub} uppercase tracking-wider ml-1 transition-colors duration-300`}
                >
                  Moral / Lesson
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Sparkles
                      className={`h-4 w-4 ${theme.iconColor} group-focus-within:text-blue-500 transition-colors`}
                    />
                  </div>
                  <input
                    type="text"
                    name="lesson"
                    value={formData.lesson}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Always tell the truth, Sharing is caring..."
                    className={`block w-full pl-10 pr-4 py-3 ${theme.inputBg} border ${theme.inputBorder} rounded-xl ${theme.inputText} ${theme.inputPlaceholder} focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all text-sm duration-300`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                <span className="relative flex items-center justify-center gap-2 text-base tracking-wide">
                  {loading ? (
                    <>
                      <Wand2 className="animate-spin w-5 h-5" /> Generating...
                    </>
                  ) : (
                    <>
                      Generate Magic Story <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateStory;
