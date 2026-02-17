import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CreateStorySection from "../components/story/CreateStorySection";
import CustomizeExperienceSection from "../components/story/CreateCustomizeExperienceSection";
import FinalTouchesSection from "../components/story/FinalTouchesSection";
import { ArrowRight, Wand2 } from "lucide-react";
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
        let ageNum = 7;
        if (formData.ageGroup === "3-5") ageNum = 4;
        if (formData.ageGroup === "5-8") ageNum = 7;
        if (formData.ageGroup === "9+") ageNum = 10;

        const payload = {
          ...formData,
          age: ageNum,
          lesson: `A story set in ${formData.locationName || "a magical place"}. Language: ${formData.language}. Duration: ${formData.duration}.`,
        };

        const response = await fetch(`${SERVER_URL}/api/v1/generate-story`, {
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

  return (
    <div
      className={`min-h-screen ${COLORS.background.main} ${FONTS.main} ${COLORS.text.main} flex flex-col items-center py-10 px-4`}
    >
      {/* Top Progress Pill */}
      <div className="mb-8">
        <div
          className={`bg-yellow-50 ${COLORS.primary.text} font-bold px-6 py-2 rounded-full border border-yellow-200 shadow-sm text-sm`}
        >
          Step {activeSection} of 3
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center mb-8">
        <h1 className={`text-4xl md:text-5xl ${FONTS.heading} mb-3`}>
          Let's build a story!
        </h1>
        <p className={`${COLORS.text.sub} font-medium`}>
          First, tell us the basics of your adventure.
        </p>
      </div>

      {/* Card Container */}
      <div
        className={`w-full max-w-2xl ${COLORS.background.card} ${STYLES.card}`}
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
      </div>

      {/* Bottom Navigation Area */}
      <div className="mt-8 flex gap-4 w-full max-w-2xl justify-end">
        {activeSection > 1 && (
          <button onClick={handleBack} className={STYLES.button.secondary}>
            Back
          </button>
        )}

        {activeSection < 3 ? (
          <button
            onClick={handleNext}
            className={`${COLORS.primary.DEFAULT} ${COLORS.primary.hover} ${STYLES.button.primary} ${COLORS.primary.shadow}`}
          >
            Next Step <ArrowRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`${COLORS.primary.DEFAULT} ${COLORS.primary.hover} ${STYLES.button.primary} ${COLORS.primary.shadow}`}
          >
            {loading ? (
              <>
                <Wand2 className="animate-spin" /> Creating...
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
  );
};

export default CreateStory;
