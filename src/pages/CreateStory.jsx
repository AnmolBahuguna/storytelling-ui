import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CreateStorySection from "../components/story/CreateStorySection.jsx";
import CustomizeExperienceSection from "../components/story/CreateCustomizeExperienceSection.jsx";
import FinalTouchesSection from "../components/story/FinalTouchesSection.jsx";
import Sidebar from "../components/story/Sidebar.jsx"; // <-- Added Sidebar Import
import { ArrowRight, Wand2, Stars, Sun, Moon } from "lucide-react";
import { StarsBackground } from "../components/animate-ui/components/backgrounds/stars-blue.jsx";

const SERVER_URL =
  import.meta && import.meta.env && import.meta.env.VITE_SERVER_URL
    ? import.meta.env.VITE_SERVER_URL
    : "http://localhost:8000";

const CreateStory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return true;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const [formData, setFormData] = useState({
    heroName: "", ageGroup: "5-8", theme: "space", mediaType: "read", duration: "short", locationName: "", language: "English",
  });

  const getAccessToken = () => {
    return document.cookie.split("; ").find((row) => row.startsWith("access_token="))?.split("=")[1];
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/");
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (activeSection === 1 && !formData.heroName) return alert("Please tell us the hero's name!");
    setActiveSection((prev) => prev + 1);
  };

  const handleBack = () => setActiveSection((prev) => prev - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const generateStory = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          alert("Session expired. Please log in again.");
          return navigate("/");
        }

        let ageNum = 7;
        if (formData.ageGroup === "1-3") ageNum = 2;
        if (formData.ageGroup === "3-5") ageNum = 4;
        if (formData.ageGroup === "5-8") ageNum = 7;
        if (formData.ageGroup === "9-14") ageNum = 11;

        const payload = {
          ...formData, age: ageNum, lesson: `A story set in ${formData.locationName || "a magical place"}. Language: ${formData.language}. Duration: ${formData.duration}.`,
        };

        const response = await fetch(`${SERVER_URL}/api/generate-story`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          navigate("/story-view", { state: { story: data.story } });
        } else {
          if (response.status === 401) {
            alert("Unauthorized! Please login again.");
            navigate("/");
          } else {
            alert("Error: " + (data.message || "Failed to generate story"));
          }
        }
      } catch (error) {
        console.error("Connection Error:", error);
        alert(`Failed to connect to server.`);
      } finally {
        setLoading(false);
      }
    };
    generateStory();
  };

  // --- Handlers for the Sidebar ---
  const handlePlayStory = (story) => {
    navigate("/story-view", { state: { story: story } });
  };

  const handlePlayPlaylist = (playlist) => {
    if (playlist.stories && playlist.stories.length > 0) {
      navigate("/story-view", {
        state: { 
          story: playlist.stories[0], 
          playlist: playlist, 
          playlistIndex: 0 
        }
      });
    }
  };

  if (!isAuthorized) return null;

  const stepLabels = ["The Hero", "The Adventure", "Final Touches"];

  // --- WRAPPED IN A FLEX CONTAINER FOR THE SIDEBAR ---
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      
      {/* SIDEBAR ON THE LEFT */}
      <Sidebar onPlayStory={handlePlayStory} onPlayPlaylist={handlePlayPlaylist} />
      
      {/* MAIN CONTENT AREA ON THE RIGHT */}
      <main className={`relative flex-1 flex flex-col items-center py-10 px-4 overflow-y-auto transition-colors duration-700`}>
        
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all z-50"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="absolute inset-0 z-0 pointer-events-none">
          <StarsBackground isDarkMode={isDarkMode} />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center mt-12 md:mt-4">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
            <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full shadow-lg text-sm font-medium transition-colors">
              <Stars size={16} className="text-blue-500" />
              Step {activeSection} of 3 — {stepLabels[activeSection - 1]}
            </div>
          </motion.div>

          <div className="w-full max-w-2xl mb-6">
            <div className="flex gap-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex-1 h-2.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 backdrop-blur-sm transition-colors">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
                    initial={{ width: "0%" }}
                    animate={{ width: activeSection >= step ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 drop-shadow-sm transition-colors">
              Let's Build a Story!
            </h1>
            <p className="text-blue-600 dark:text-blue-400 font-bold text-base drop-shadow-sm transition-colors">
              {activeSection === 1 && "Tell us about your hero! 🦸"}
              {activeSection === 2 && "Where does the adventure take place? 🗺️"}
              {activeSection === 3 && "Almost ready! Pick the finishing touches 🎉"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-2xl relative transition-colors duration-700"
          >
            <AnimatePresence mode="wait">
              {activeSection === 1 && <CreateStorySection key="step1" formData={formData} updateFormData={updateFormData} />}
              {activeSection === 2 && <CustomizeExperienceSection key="step2" formData={formData} updateFormData={updateFormData} />}
              {activeSection === 3 && <FinalTouchesSection key="step3" formData={formData} updateFormData={updateFormData} />}
            </AnimatePresence>
          </motion.div>

          <div className="mt-8 flex gap-4 w-full max-w-2xl justify-end">
            {activeSection > 1 && (
              <button onClick={handleBack} className="px-6 py-3 rounded-xl font-bold transition-all bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700">
                ← Back
              </button>
            )}

            {activeSection < 3 ? (
              <button onClick={handleNext} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl border-0">
                Next Step <ArrowRight size={20} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl border-0 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? <><Wand2 className="animate-spin" /> Creating Magic...</> : <><Wand2 /> Create Story</>}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateStory;