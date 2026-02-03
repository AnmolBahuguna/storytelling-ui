import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  RefreshCcw,
  Download,
  Volume2,
  Loader2,
  StopCircle,
  PlayCircle,
  PauseCircle,
} from "lucide-react";

// Mock Data for Fallback
const MOCK_STORY_FALLBACK = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  // Using loremflickr for random cartoon/fantasy images appropriate for kids
  // Added 'lock' parameter to ensure consistent images for each slide index
  image: `https://loremflickr.com/1080/1920/cartoon,fantasy,illustration/all?lock=${i + 10}`,
  text: `This is page ${i + 1} of the magical adventure. The hero enters a new realm filled with wonder, facing challenges that require bravery and wit to overcome. The stars shine brightly above as the journey continues.`,
}));

const StoryViewer = () => {
  const location = useLocation();
  const storyData = location.state?.story;
  const slides = storyData?.slides || MOCK_STORY_FALLBACK;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // Ref to handle audio playback
  const audioRef = useRef(new Audio());

  const currentSlide = slides[currentIndex];

  // Stop audio when slide changes or component unmounts
  // Also handles Auto-Play triggering logic
  useEffect(() => {
    // 1. Stop any currently playing audio from previous slide
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // 2. If Auto-Play is ON, strictly start the next audio
    if (isAutoPlaying) {
      handlePlayAudio();
    } else {
      // Only reset playing state if NOT auto-playing (avoids UI flicker)
      setIsPlaying(false);
      setIsAudioLoading(false);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentIndex]);

  // Handle Play/Pause Toggle
  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      // STOP
      setIsAutoPlaying(false);
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    } else {
      // START
      setIsAutoPlaying(true);
      handlePlayAudio();
    }
  };

  // --- PDF Generation Logic (3:2 Ratio) ---
  const downloadPDF = async () => {
    setIsPdfGenerating(true);

    // Custom 3:2 Aspect Ratio Page (e.g., 300mm x 200mm)
    const pageWidth = 300;
    const pageHeight = 200;
    const margin = 10;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [pageWidth, pageHeight],
    });

    // Layout Calculations (60% Image, 40% Text)
    const imageWidth = (pageWidth - margin * 3) * 0.6;
    const imageHeight = pageHeight - margin * 2;
    const textStartX = margin + imageWidth + margin;
    const textWidth = (pageWidth - margin * 3) * 0.4;

    try {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];

        if (i > 0) doc.addPage([pageWidth, pageHeight], "landscape");

        // 1. Add Image (Left Side)
        try {
          const imgData = await getImageData(slide.image);
          doc.addImage(
            imgData,
            "JPEG",
            margin,
            margin,
            imageWidth,
            imageHeight,
          );
        } catch (err) {
          console.error("Failed to load image for PDF:", err);
          doc.text("[Image could not be loaded]", margin, pageHeight / 2);
        }

        // 2. Add Text (Right Side)
        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        const textLines = doc.splitTextToSize(slide.text, textWidth);
        doc.text(textLines, textStartX, margin + 20);

        // 3. Add Page Number
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          `Page ${i + 1}`,
          textStartX + textWidth / 2,
          pageHeight - margin,
          null,
          null,
          "center",
        );
        doc.setTextColor(0);
      }

      doc.save(`${storyData?.title || "magic-story"}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Helper to convert URL to base64 for PDF
  const getImageData = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Handle CORS
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  };

  // --- Audio Logic ---
  const handlePlayAudio = async () => {
    try {
      setIsAudioLoading(true);
      setIsPlaying(true); // Optimistic UI update

      const response = await fetch(
        "http://localhost:5000/api/generate-speech",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: currentSlide.text }),
        },
      );

      if (!response.ok) throw new Error("Failed to fetch audio");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      audioRef.current.src = url;
      audioRef.current.play();
      setIsAudioLoading(false);

      // Handle Audio End -> Auto Advance
      audioRef.current.onended = () => {
        if (isAutoPlaying) {
          if (currentIndex < slides.length - 1) {
            handleNext();
          } else {
            setIsAutoPlaying(false);
            setIsPlaying(false);
          }
        } else {
          setIsPlaying(false);
        }
      };
    } catch (error) {
      console.error("Audio Error:", error);
      setIsAudioLoading(false);
      setIsAutoPlaying(false);
      setIsPlaying(false);

      // Fallback: Browser TTS
      const utterance = new SpeechSynthesisUtterance(currentSlide.text);
      utterance.onend = () => {
        if (isAutoPlaying && currentIndex < slides.length - 1) {
          handleNext();
        }
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, slides.length]);

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full h-screen bg-[#020205] overflow-hidden flex flex-col font-sans">
      {/* --- Top Bar --- */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <Link
          to="/create-story"
          className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <Home size={20} />
        </Link>
        <div className="flex gap-3">
          {/* Auto Play Button (Green when playing, White when paused) */}
          <button
            onClick={toggleAutoPlay}
            className={`flex items-center gap-2 px-5 py-2.5 backdrop-blur-md rounded-full font-bold text-sm tracking-wide transition-all duration-300 transform hover:scale-105 ${
              isAutoPlaying
                ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.6)] border border-green-400"
                : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
            }`}
            title="Auto Play Story"
          >
            {isAutoPlaying ? (
              <>
                {" "}
                <PauseCircle size={18} className="animate-pulse" /> PLAYING{" "}
              </>
            ) : (
              <>
                {" "}
                <PlayCircle size={18} /> START STORY{" "}
              </>
            )}
          </button>

          {/* Download PDF Button */}
          <button
            onClick={downloadPDF}
            disabled={isPdfGenerating}
            className={`p-2.5 backdrop-blur-md rounded-full text-white transition-all duration-300 ${
              isPdfGenerating
                ? "bg-white/5 cursor-wait opacity-50"
                : "bg-white/10 hover:bg-white/20"
            }`}
            title="Download PDF"
          >
            {isPdfGenerating ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Download size={20} />
            )}
          </button>
        </div>
      </div>

      {/* --- Main Content Split Layout --- */}
      <div className="flex flex-col md:flex-row h-full w-full relative">
        {/* --- Left: Image Area (60%) --- */}
        <div className="relative w-full md:w-[60%] h-[50%] md:h-full bg-slate-900 overflow-hidden shadow-2xl z-10">
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
              alt={`Scene ${currentSlide.id || currentIndex + 1}`}
            />
          </AnimatePresence>
          {/* Gradients for text readability if needed, mostly for mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#020205] to-transparent pointer-events-none hidden md:block" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020205] to-transparent pointer-events-none md:hidden" />
        </div>

        {/* --- Right: Text Area (40%) --- */}
        <div className="w-full md:w-[40%] h-[50%] md:h-full bg-[#020205] text-white p-6 md:p-12 flex flex-col justify-center relative z-20 border-l border-white/5">
          {/* Progress Dots */}
          <div className="flex gap-1.5 mb-8 justify-center md:justify-start">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "w-2 bg-slate-800"}`}
              />
            ))}
          </div>

          {/* Story Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex items-center"
            >
              <p className="text-xl md:text-2xl leading-relaxed text-slate-300 font-medium font-serif">
                {currentSlide.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Manual Controls */}
          <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
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
              {currentIndex + 1} / {slides.length}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === slides.length - 1}
              className="p-4 rounded-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
            >
              <ChevronRight
                size={28}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* Audio Status Indicator */}
          {isAudioLoading && (
            <div className="absolute top-6 right-6 flex items-center gap-2 text-xs text-blue-400 font-mono animate-pulse">
              <Loader2 size={12} className="animate-spin" /> Loading Audio...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
