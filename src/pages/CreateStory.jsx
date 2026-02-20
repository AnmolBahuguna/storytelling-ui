import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CreateStorySection from "../components/story/CreateStorySection";
import CustomizeExperienceSection from "../components/story/CreateCustomizeExperienceSection";
import FinalTouchesSection from "../components/story/FinalTouchesSection";
import { ArrowRight, Wand2, Stars } from "lucide-react";
import { COLORS, STYLES, FONTS } from "../constants/theme";

// Get Server URL
const SERVER_URL =
  import.meta && import.meta.env && import.meta.env.VITE_SERVER_URL
    ? import.meta.env.VITE_SERVER_URL
    : "http://localhost:5000";

const CreateStory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(1);

  const [formData, setFormData] = useState({
    heroName: "",
    ageGroup: "5-8",
    theme: "space",
    mediaType: "read",
    duration: "short",
    locationName: "",
    language: "English",
  });

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
        let ageNum = 7; // Default

        // Updated backend mapping for the new age groups
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.success) {
          navigate("/story-view", { state: { story: data.story } });
        } else {
          alert("Error: " + (data.message || "Unknown error"));
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

  // Step labels
  const stepLabels = ["The Hero", "The Adventure", "Final Touches"];

  return (
    <div
      className={`min-h-screen ${FONTS.main} ${COLORS.text.main} flex flex-col items-center py-10 px-4`}
    >
      {/* Header badge */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <div className="step-pill flex items-center gap-2">
          <Stars size={15} />
          Step {activeSection} of 3 — {stepLabels[activeSection - 1]}
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className="flex-1 h-2.5 rounded-full overflow-hidden bg-blue-100"
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
          className={`text-4xl md:text-5xl ${FONTS.heading} ${COLORS.text.main} mb-2`}
        >
          ✨ Let's Build a Story!
        </h1>
        <p className={`${COLORS.text.sub} font-bold text-base`}>
          {activeSection === 1 && "Tell us about your hero! 🦸"}
          {activeSection === 2 && "Where does the adventure take place? 🗺️"}
          {activeSection === 3 && "Almost ready! Pick the finishing touches 🎉"}
        </p>
      </motion.div>

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className={`w-full max-w-2xl bg-white ${STYLES.card}`}
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
          <button onClick={handleBack} className={STYLES.button.secondary}>
            ← Back
          </button>
        )}

        {activeSection < 3 ? (
          <button
            onClick={handleNext}
            className={`${COLORS.primary.DEFAULT} ${COLORS.primary.hover} ${STYLES.button.primary}`}
          >
            Next Step <ArrowRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`${COLORS.primary.DEFAULT} ${COLORS.primary.hover} ${STYLES.button.primary} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <>
                <Wand2 className="animate-spin" /> Creating Magic...
              </>
            ) : (
              <>
                <Wand2 /> Create Story! 🌟
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateStory;
