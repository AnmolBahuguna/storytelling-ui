import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Download,
  Loader2,
  PlayCircle,
  Square,
} from "lucide-react";
import { COLORS } from "../constants/theme";

// Get Server URL from environment variable
const SERVER_URL =
  import.meta && import.meta.env && import.meta.env.VITE_SERVER_URL
    ? import.meta.env.VITE_SERVER_URL
    : "http://localhost:5000";

// Mock Data for Fallback
const MOCK_STORY_FALLBACK = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  image: `https://loremflickr.com/1080/1920/cartoon,fantasy,illustration/all?lock=${i + 10}`,
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

  // Triggers the next slide safely avoiding stale closures
  const [audioTrigger, setAudioTrigger] = useState(0);

  const audioRef = useRef(new Audio());

  // Audio Cache: Stores Promises that resolve to Object URLs for seamless playback
  const audioCache = useRef({});

  const currentSlide = slides[currentIndex];

  // Helper to resolve full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${SERVER_URL}${imagePath}`;
  };

  const currentImageUrl = getImageUrl(currentSlide.image);

  // --- MEMORY CLEANUP ---
  // Ensure we revoke the created Object URLs when the component unmounts
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

  // --- AUDIO LOGIC (Prefetching & Closure-Safe) ---
  useEffect(() => {
    let isMounted = true;

    const playAudio = async () => {
      // If user stopped autoplay, halt everything
      if (!isAutoPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsAudioLoading(false);
        return;
      }

      try {
        setIsAudioLoading(true);

        // 1. Fetch or get cached audio for CURRENT slide
        if (!audioCache.current[currentIndex]) {
          audioCache.current[currentIndex] = fetch(
            `${SERVER_URL}/api/generate-speech`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: slides[currentIndex].text }),
            },
          )
            .then((res) => {
              if (!res.ok) throw new Error("Failed to fetch audio");
              return res.blob();
            })
            .then((blob) => URL.createObjectURL(blob));
        }

        // Await the promise (it will be instant if already prefetched)
        const url = await audioCache.current[currentIndex];

        // Prevent playing if user navigated away or stopped while fetching
        if (!isMounted || !isAutoPlaying) return;

        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
        setIsAudioLoading(false);

        // 2. PRE-FETCH NEXT SLIDE AUDIO (Background Task)
        const nextIndex = currentIndex + 1;
        if (nextIndex < slides.length && !audioCache.current[nextIndex]) {
          audioCache.current[nextIndex] = fetch(
            `${SERVER_URL}/api/generate-speech`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
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
              // Delete failed promise so it can be retried when the user actually reaches the slide
              delete audioCache.current[nextIndex];
            });
        }

        // 3. When audio finishes, trigger the advancement state
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
          delete audioCache.current[currentIndex]; // allow retry
        }
      }
    };

    playAudio();

    // Cleanup: Stop audio immediately if slide changes or component unmounts
    return () => {
      isMounted = false;
      audioRef.current.pause();
      audioRef.current.onended = null;
    };
  }, [currentIndex, isAutoPlaying, slides]);

  // --- AUTO-ADVANCE LOGIC ---
  useEffect(() => {
    // Only run if audio just finished AND we are still in AutoPlay mode
    if (audioTrigger > 0 && isAutoPlaying) {
      if (currentIndex < slides.length - 1) {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Reached the end of the story
        setIsAutoPlaying(false);
      }
    }
  }, [audioTrigger]);

  const downloadPDF = async () => {
    setIsPdfGenerating(true);
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [300, 200],
    });

    const pageWidth = 300;
    const pageHeight = 200;
    const margin = 10;
    const imageWidth = (pageWidth - margin * 3) * 0.6;
    const imageHeight = pageHeight - margin * 2;
    const textStartX = margin + imageWidth + margin;
    const textWidth = (pageWidth - margin * 3) * 0.4;

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
            imageWidth,
            imageHeight,
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
          "center",
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
  };

  const getImageData = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
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
      className={`fixed inset-0 w-full h-full ${COLORS.background.main} flex flex-col font-sans overflow-hidden`}
    >
      {/* --- Header --- */}
      <div className="absolute top-0 left-0 right-0 z-50 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <Link
          to="/create-story"
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
        >
          <Home size={18} />
          <span className="hidden md:inline font-bold text-sm">Home</span>
        </Link>

        <div className="flex gap-2 md:gap-3">
          {/* Enhanced Auto Play Button with Square (Stop) Icon */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full font-bold text-xs md:text-sm transition-all duration-300 shadow-sm ${
              isAutoPlaying
                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {isAutoPlaying ? (
              <>
                {" "}
                <Square fill="currentColor" size={14} />{" "}
                <span className="hidden sm:inline">Stop</span>{" "}
              </>
            ) : (
              <>
                {" "}
                <PlayCircle size={16} />{" "}
                <span className="hidden sm:inline">Read to Me</span>{" "}
              </>
            )}
          </button>

          {/* Download PDF */}
          <button
            onClick={downloadPDF}
            disabled={isPdfGenerating}
            className="p-2 md:px-4 md:py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-full transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
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
        <div className="relative w-full h-[55%] md:h-full md:w-[60%] bg-slate-100 overflow-hidden shadow-inner md:shadow-none">
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
                  "https://placehold.co/600x400?text=Image+Not+Found";
              }}
            />
          </AnimatePresence>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent md:hidden" />
        </div>

        {/* --- Text Section --- */}
        <div
          className={`relative w-full h-[45%] md:h-full md:w-[40%] ${COLORS.background.card} flex flex-col justify-between p-6 md:p-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-20`}
        >
          {/* Progress Indicator */}
          <div className="flex justify-center md:justify-start gap-1.5 mb-4">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-yellow-400" : "w-2 bg-slate-200"}`}
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
                className={`text-lg md:text-2xl leading-relaxed ${COLORS.text.main} font-medium text-center md:text-left`}
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
              className="p-4 rounded-full bg-slate-100 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 hover:text-slate-600 transition-all"
            >
              <ChevronLeft size={24} />
            </button>

            <span className="text-sm font-bold text-slate-400">
              {currentIndex + 1} / {slides.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentIndex === slides.length - 1}
              className={`p-4 rounded-full ${COLORS.primary.DEFAULT} text-black ${COLORS.primary.shadow} shadow-lg disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed ${COLORS.primary.hover} hover:scale-105 transition-all`}
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
