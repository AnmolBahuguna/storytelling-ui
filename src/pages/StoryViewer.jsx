import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  RefreshCcw,
  Download,
} from "lucide-react";

// Mock Data for 12 Slides
const MOCK_STORY = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  // Using loremflickr for random cartoon/fantasy images appropriate for kids
  // Added 'lock' parameter to ensure consistent images for each slide index
  image: `https://loremflickr.com/1080/1920/cartoon,fantasy,illustration/all?lock=${i + 10}`,
  text: `This is page ${i + 1} of the magical adventure. The hero enters a new realm filled with wonder, facing challenges that require bravery and wit to overcome. The stars shine brightly above as the journey continues.`,
}));

const StoryViewer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isDarkMode, setIsDarkMode] = useState(true); // Keeping dark mode by default for cinema feel

  const handleNext = () => {
    if (currentIndex < MOCK_STORY.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const currentSlide = MOCK_STORY[currentIndex];

  return (
    <div className="relative w-full h-screen bg-[#020205] overflow-hidden flex flex-col font-sans">
      {/* --- Top Bar (Navigation & Actions) --- */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <Link
          to="/create-story"
          className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <Home size={20} />
        </Link>
        <div className="flex gap-2">
          <button
            className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
            title="Regenerate"
          >
            <RefreshCcw size={20} />
          </button>
          <button
            className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
            title="Download"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* --- Main Content Container --- */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* --- Top 65%: Image Area --- */}
        <div className="relative h-[65%] w-full bg-slate-900 overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentIndex}
              src={currentSlide.image}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 w-full h-full object-cover"
              alt={`Scene ${currentSlide.id}`}
            />
          </AnimatePresence>

          {/* Image Gradient Overlay at bottom for smooth text transition */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020205] to-transparent pointer-events-none" />
        </div>

        {/* --- Bottom 35%: Text Area --- */}
        <div className="h-[35%] w-full bg-[#020205] text-white p-6 md:p-10 flex flex-col items-center justify-start relative z-10">
          {/* Progress Indicators */}
          <div className="flex gap-1.5 mb-6">
            {MOCK_STORY.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-6 bg-blue-500" : "w-2 bg-slate-700"}`}
              />
            ))}
          </div>

          {/* Story Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center max-w-2xl"
            >
              <p className="text-lg md:text-xl leading-relaxed text-slate-200 font-medium">
                {currentSlide.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute bottom-8 left-0 right-0 px-6 flex justify-between items-center w-full max-w-4xl mx-auto">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-white group"
            >
              <ChevronLeft
                size={28}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </button>

            <div className="text-sm text-slate-500 font-mono">
              {currentIndex + 1} / {MOCK_STORY.length}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === MOCK_STORY.length - 1}
              className="p-4 rounded-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
            >
              <ChevronRight
                size={28}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
