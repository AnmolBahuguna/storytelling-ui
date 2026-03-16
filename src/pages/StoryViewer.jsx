import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// import { jsPDF } from "jspdf"; // Uncomment this locally when the jspdf package is installed
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Download,
  Loader2,
  PlayCircle,
  Square,
  Sun,
  Moon,
} from "lucide-react";
import { COLORS } from "../constants/theme";

// Hardcoded for preview environment to prevent 'import.meta' build errors
const SERVER_URL = "http://localhost:8000";

// Mock Data for Fallback
const MOCK_STORY_FALLBACK = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  image: `https://loremflickr.com/1080/1080/cartoon,fantasy,illustration/all?lock=${i + 10}`,
  text: `This is page ${i + 1} of the magical adventure. The hero enters a new realm filled with wonder, facing challenges that require bravery and wit to overcome.`,
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

  // Theme logic synchronized with the rest of the application
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      )
        return true;
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

  // Triggers the next slide safely avoiding stale closures
  const [audioTrigger, setAudioTrigger] = useState(0);

  const audioRef = useRef(new Audio());
  const audioCache = useRef({});

  const currentSlide = slides[currentIndex];

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/600x600?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${SERVER_URL}${imagePath}`;
  };

  const currentImageUrl = getImageUrl(currentSlide.image);

  useEffect(() => {
    const cache = audioCache.current;
    return () => {
      Object.values(cache).forEach((promise) => {
        promise
          .then((url) => {
            if (typeof url === "string") URL.revokeObjectURL(url);
          })
          .catch(() => {});
      });
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const playAudio = async () => {
      if (!isAutoPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsAudioLoading(false);
        return;
      }

      try {
        setIsAudioLoading(true);

        if (!audioCache.current[currentIndex]) {
          audioCache.current[currentIndex] = fetch(
            `${SERVER_URL}/api/generate-speech`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${
                  document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("access_token="))
                    ?.split("=")[1]
                }`,
              },
              body: JSON.stringify({ text: slides[currentIndex].text }),
            },
          )
            .then((res) => {
              if (!res.ok) throw new Error("Failed to fetch audio");
              return res.blob();
            })
            .then((blob) => URL.createObjectURL(blob));
        }

        const url = await audioCache.current[currentIndex];

        if (!isMounted || !isAutoPlaying) return;

        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
        setIsAudioLoading(false);

        const nextIndex = currentIndex + 1;
        if (nextIndex < slides.length && !audioCache.current[nextIndex]) {
          audioCache.current[nextIndex] = fetch(
            `${SERVER_URL}/api/generate-speech`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${
                  document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("access_token="))
                    ?.split("=")[1]
                }`,
              },
              body: JSON.stringify({ text: slides[nextIndex].text }),
            },
          )
            .then((res) => {
              if (!res.ok) throw new Error("Failed to fetch audio");
              return res.blob();
            })
            .then((blob) => URL.createObjectURL(blob))
            .catch((err) => {
              console.error("Prefetch failed:", err);
              delete audioCache.current[nextIndex];
            });
        }

        audioRef.current.onended = () => {
          if (isMounted) {
            setIsPlaying(false);
            setAudioTrigger((prev) => prev + 1);
          }
        };
      } catch (error) {
        console.error("Audio Error:", error);
        if (isMounted) {
          setIsAudioLoading(false);
          setIsPlaying(false);
          setIsAutoPlaying(false);
          delete audioCache.current[currentIndex];
        }
      }
    };

    playAudio();

    return () => {
      isMounted = false;
      audioRef.current.pause();
      audioRef.current.onended = null;
    };
  }, [currentIndex, isAutoPlaying, slides]);

  useEffect(() => {
    if (audioTrigger > 0 && isAutoPlaying) {
      if (currentIndex < slides.length - 1) {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsAutoPlaying(false);
      }
    }
  }, [audioTrigger]);

  const downloadPDF = async () => {
    setIsPdfGenerating(true);

    // MOCKED FOR PREVIEW ENVIRONMENT
    // Added a simulated delay to prevent build errors related to missing 'jspdf' package
    setTimeout(() => {
      alert(
        "PDF download is mocked in this preview. Please install 'jspdf' and uncomment the logic in your local environment!",
      );
      setIsPdfGenerating(false);
    }, 1500);

    /* --- UNCOMMENT THIS BLOCK FOR YOUR LOCAL ENVIRONMENT ---
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [300, 200],
    });

    const pageWidth = 300;
    const pageHeight = 200;
    const margin = 10;
    // Update image logic for PDF to keep 1:1 visual ratio
    const imageSize = pageHeight - margin * 2; 
    const textStartX = margin + imageSize + margin;
    const textWidth = pageWidth - textStartX - margin;

    try {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        if (i > 0) doc.addPage([pageWidth, pageHeight], "landscape");

        try {
          const imgData = await getImageData(getImageUrl(slide.image));
          doc.addImage(
            imgData,
            "JPEG",
            margin,
            margin,
            imageSize,
            imageSize
          );
        } catch (err) {
          console.error("Failed to load image for PDF:", err);
          doc.text("[Image Error: Could not load]", margin, pageHeight / 2);
        }

        doc.setFontSize(16);
        doc.setFont("helvetica", "normal");
        const textLines = doc.splitTextToSize(slide.text, textWidth);
        doc.text(textLines, textStartX, margin + 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          `Page ${i + 1}`,
          textStartX + textWidth / 2,
          pageHeight - margin,
          null,
          null,
          "center"
        );
        doc.setTextColor(0);
      }
      doc.save(`${storyData?.title || "magic-story"}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Could not generate PDF.");
    } finally {
      setIsPdfGenerating(false);
    }
    */
  };

  // Kept intact so it's available when you uncomment the PDF logic above
  const getImageData = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Ensure square bounds during PDF generation scaling
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        // Center crop the image if it's not already 1:1
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;
        ctx.drawImage(img, startX, startY, size, size, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = (e) => reject(e);
      img.src = url;
    });
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
    <div
      className={`fixed inset-0 w-full h-full flex flex-col font-sans overflow-hidden transition-colors duration-700 ${
        isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* --- Header --- */}
      <div className="absolute top-0 left-0 right-0 z-50 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/20 shadow-sm transition-colors duration-700">
        <Link
          to="/create-story"
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Home size={18} />
          <span className="hidden md:inline font-bold text-sm">Home</span>
        </Link>

        <div className="flex gap-2 md:gap-3 items-center">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 md:px-3 md:py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-all shadow-sm flex items-center justify-center"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Enhanced Auto Play Button with Square (Stop) Icon */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all duration-300 shadow-sm ${
              isAutoPlaying
                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Square fill="currentColor" size={14} />
                <span className="hidden sm:inline">Stop</span>
              </>
            ) : (
              <>
                <PlayCircle size={16} />
                <span className="hidden sm:inline">Read to Me</span>
              </>
            )}
          </button>

          {/* Download PDF */}
          <button
            onClick={downloadPDF}
            disabled={isPdfGenerating}
            className="p-2 md:px-4 md:py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
            title="Download PDF"
          >
            {isPdfGenerating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            <span className="hidden md:inline font-bold text-xs">PDF</span>
          </button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex flex-col md:flex-row h-full w-full pt-[60px] md:pt-[72px]">
        {/* --- Image Section --- */}
        <div className="relative flex items-center justify-center w-full h-[45%] sm:h-[50%] md:h-full md:w-[50%] lg:w-[55%] bg-slate-200 dark:bg-slate-950 p-4 sm:p-6 md:p-8 lg:p-12 z-10 transition-colors duration-700">
          {/* Centered 1:1 Container */}
          <div className="relative aspect-square w-full h-auto max-h-full md:w-auto md:h-full md:max-w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl bg-slate-300 dark:bg-slate-800">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={currentIndex}
                src={currentImageUrl}
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
                alt={`Scene ${currentIndex + 1}`}
                onError={(e) => {
                  console.error("Failed to load image:", currentImageUrl);
                  e.target.src =
                    "https://placehold.co/600x600?text=Image+Not+Found";
                }}
              />
            </AnimatePresence>
            {/* Subtle inner shadow overlay */}
            <div className="absolute inset-0 shadow-inner rounded-2xl sm:rounded-3xl pointer-events-none" />
          </div>
        </div>

        {/* --- Text Section --- */}
        <div
          className={`relative w-full h-[55%] sm:h-[50%] md:h-full md:flex-1 bg-white dark:bg-slate-900 flex flex-col justify-between p-6 md:p-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-20 transition-colors duration-700`}
        >
          {/* Progress Indicator */}
          <div className="flex justify-center md:justify-start gap-1.5 mb-4">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 bg-blue-500 dark:bg-blue-400"
                    : "w-2 bg-slate-200 dark:bg-slate-700"
                }`}
              />
            ))}
          </div>

          {/* Story Text */}
          <div className="flex-1 overflow-y-auto no-scrollbar flex items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`text-lg md:text-2xl leading-relaxed text-slate-800 dark:text-slate-200 font-medium text-center md:text-left`}
              >
                {currentSlide.text}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Audio Playing Indicator */}
          {isAudioLoading && (
            <div className="flex justify-center md:justify-start items-center gap-2 text-xs text-blue-500 font-bold uppercase tracking-widest animate-pulse py-2">
              <Loader2 size={12} className="animate-spin" /> Loading Audio...
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
            >
              <ChevronLeft size={24} />
            </button>

            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
              {currentIndex + 1} / {slides.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === slides.length - 1}
              className={`p-4 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed hover:bg-blue-700 hover:scale-105 transition-all`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
