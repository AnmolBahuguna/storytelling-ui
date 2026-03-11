import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CreateStorySection from "../components/story/CreateStorySection.jsx";
import CustomizeExperienceSection from "../components/story/CreateCustomizeExperienceSection.jsx";
import FinalTouchesSection from "../components/story/FinalTouchesSection.jsx";
import { ArrowRight, Wand2, Stars, Lock } from "lucide-react";
import { COLORS, STYLES, FONTS } from "../constants/theme.js";
import { StarsBackground } from "../components/animate-ui/components/backgrounds/stars-blue.jsx";

// Server URL (matching your previous setup)
const SERVER_URL = "http://localhost:8000";

const CreateStory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [formData, setFormData] = useState({
    heroName: "",
    ageGroup: "5-8",
    theme: "space",
    mediaType: "read",
    duration: "short",
    locationName: "",
    language: "English",
  });

  // Helper to retrieve the access token from cookies
  const getAccessToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("access_token="))
      ?.split("=")[1];
  };

  // Authorization Check on Mount
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      // If no token, redirect to home so they can see the login modal
      navigate("/");
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (activeSection === 1 && !formData.heroName) {
      return alert("Please tell us the hero's name!");
    }
    setActiveSection((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveSection((prev) => prev - 1);
  };

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
          ...formData,
          age: ageNum,
          lesson: `A story set in ${formData.locationName || "a magical place"}. Language: ${formData.language}. Duration: ${formData.duration}.`,
        };

        const response = await fetch(`${SERVER_URL}/api/generate-story`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorizing the API request with the Bearer token
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          navigate("/story-view", { state: { story: data.story } });
        } else {
          // Handle 401 Unauthorized errors from backend
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

  // Prevent flicker before redirect
  if (!isAuthorized) return null;

  const stepLabels = ["The Hero", "The Adventure", "Final Touches"];

  return (
    <div
      className={`relative min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 ${FONTS.main} flex flex-col items-center py-10 px-4`}
    >
      <div className="fixed inset-0 z-0 pointer-events-none">
        <StarsBackground />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Header badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-full shadow-lg text-sm font-medium">
            <Stars size={16} className="text-blue-300" />
            Step {activeSection} of 3 — {stepLabels[activeSection - 1]}
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full max-w-2xl mb-6">
          <div className="flex gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="flex-1 h-2.5 rounded-full overflow-hidden bg-white/20 backdrop-blur-sm"
              >
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

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1
            className={`text-4xl md:text-5xl ${FONTS.heading} text-white mb-2 drop-shadow-md`}
          >
            Let's Build a Story!
          </h1>
          <p className={`text-blue-100 font-bold text-base drop-shadow-sm`}>
            {activeSection === 1 && "Tell us about your hero! 🦸"}
            {activeSection === 2 && "Where does the adventure take place? 🗺️"}
            {activeSection === 3 &&
              "Almost ready! Pick the finishing touches 🎉"}
          </p>
        </motion.div>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className={`w-full max-w-2xl bg-white ${STYLES.card} shadow-2xl relative`}
        >
          <AnimatePresence mode="wait">
            {activeSection === 1 && (
              <CreateStorySection
                key="step1"
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
            {activeSection === 2 && (
              <CustomizeExperienceSection
                key="step2"
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
            {activeSection === 3 && (
              <FinalTouchesSection
                key="step3"
                formData={formData}
                updateFormData={updateFormData}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4 w-full max-w-2xl justify-end">
          {activeSection > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-xl font-bold transition-all bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm"
            >
              ← Back
            </button>
          )}

          {activeSection < 3 ? (
            <button
              onClick={handleNext}
              className={`flex items-center gap-2 ${COLORS.primary.DEFAULT} ${COLORS.primary.hover} ${STYLES.button.primary} shadow-xl hover:shadow-blue-500/30 border-0`}
            >
              Next Step <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex items-center gap-2 ${COLORS.primary.DEFAULT} ${COLORS.primary.hover} ${STYLES.button.primary} shadow-xl hover:shadow-blue-500/30 border-0 disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <Wand2 className="animate-spin" /> Creating Magic...
                </>
              ) : (
                <>
                  <Wand2 /> Create Story
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateStory;
