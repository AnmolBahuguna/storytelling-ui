import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ListMusic,
} from "lucide-react";

const SERVER_URL =
  import.meta && import.meta.env && import.meta.env.VITE_SERVER_URL
    ? import.meta.env.VITE_SERVER_URL
    : "http://127.0.0.1:5000";

const MOCK_STORY_FALLBACK = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  image: `https://loremflickr.com/1080/1080/cartoon,fantasy,illustration/all?lock=${i + 10}`,
  text: `This is page ${i + 1} of the magical adventure.`,
}));

const StoryViewer = () => {
  const location = useLocation();

  // Playlist & Story State
  const [storyData, setStoryData] = useState(location.state?.story || null);
  const [playlist, setPlaylist] = useState(location.state?.playlist || null);
  const [playlistIndex, setPlaylistIndex] = useState(
    location.state?.playlistIndex || 0,
  );

  const slides = storyData?.slides || MOCK_STORY_FALLBACK;

  // Player State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

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

  // --- THE FIX: Store current state in a Ref for the Audio Event Listener ---
  const stateRef = useRef({
    currentIndex,
    slidesLength: slides.length,
    playlist,
    playlistIndex,
    isAutoPlaying,
  });

  // Keep the Ref synced with the actual state perfectly
  useEffect(() => {
    stateRef.current = {
      currentIndex,
      slidesLength: slides.length,
      playlist,
      playlistIndex,
      isAutoPlaying,
    };
  }, [currentIndex, slides.length, playlist, playlistIndex, isAutoPlaying]);

  const audioRef = useRef(new Audio());
  const audioCache = useRef({});

  const currentSlide = slides[currentIndex];

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/600x600?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${SERVER_URL}${imagePath}`;
  };

  const currentImageUrl = getImageUrl(currentSlide.image);

  // Clear cache and reset to slide 0 when the story changes (crucial for playlists)
  useEffect(() => {
    Object.values(audioCache.current).forEach((promise) => {
      promise
        .then((url) => {
          if (typeof url === "string") URL.revokeObjectURL(url);
        })
        .catch(() => {});
    });
    audioCache.current = {};
    setCurrentIndex(0);
  }, [storyData]);

  // Audio Player Logic
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

        // Fetch or load current audio from cache
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

        // Prefetch NEXT audio to prevent buffering
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
              delete audioCache.current[nextIndex];
            });
        }

        // --- THE FIX: Continuous Auto-Play Logic ---
        audioRef.current.onended = () => {
          if (!isMounted) return;
          setIsPlaying(false);

          // Get the absolute latest state from our Ref!
          const {
            currentIndex: refCurrentIdx,
            slidesLength,
            playlist: refPlaylist,
            playlistIndex: refPlaylistIdx,
            isAutoPlaying: refAutoPlaying,
          } = stateRef.current;

          if (refAutoPlaying) {
            if (refCurrentIdx < slidesLength - 1) {
              // Standard: Go to next slide
              setDirection(1);
              setCurrentIndex((prev) => prev + 1);
            } else if (
              refPlaylist &&
              refPlaylistIdx < refPlaylist.stories.length - 1
            ) {
              // Playlist: Go to NEXT STORY
              setDirection(1);
              const nextStoryIdx = refPlaylistIdx + 1;
              setPlaylistIndex(nextStoryIdx);
              setStoryData(refPlaylist.stories[nextStoryIdx]);
            } else {
              // End of the road: Stop auto-playing
              setIsAutoPlaying(false);
            }
          }
        };
      } catch (error) {
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

  // --- THE FIX: Cross-Story Navigation for Next/Prev buttons ---
  const isFirstSlideOverall =
    currentIndex === 0 && (!playlist || playlistIndex === 0);
  const isLastSlideOverall =
    currentIndex === slides.length - 1 &&
    (!playlist || playlistIndex === playlist.stories.length - 1);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else if (playlist && playlistIndex < playlist.stories.length - 1) {
      // Jump to next story in playlist
      setDirection(1);
      const nextStoryIdx = playlistIndex + 1;
      setPlaylistIndex(nextStoryIdx);
      setStoryData(playlist.stories[nextStoryIdx]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    } else if (playlist && playlistIndex > 0) {
      // Jump to previous story in playlist
      setDirection(-1);
      const prevStoryIdx = playlistIndex - 1;
      setPlaylistIndex(prevStoryIdx);
      setStoryData(playlist.stories[prevStoryIdx]);
    }
  };

  const downloadPDF = async () => {
    setIsPdfGenerating(true);
    setTimeout(() => {
      alert("PDF download is mocked in this preview.");
      setIsPdfGenerating(false);
    }, 1500);
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
      className={`fixed inset-0 w-full h-full flex flex-col font-sans overflow-hidden transition-colors duration-700 ${isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/20 shadow-sm transition-colors duration-700">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Home size={18} />
            <span className="hidden md:inline font-bold text-sm">
              Dashboard
            </span>
          </Link>

          {/* Show Playlist Info if active */}
          {playlist && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-full text-xs font-bold transition-all">
              <ListMusic size={14} />
              {playlist.name} ({playlistIndex + 1}/{playlist.stories.length})
            </div>
          )}
        </div>

        <div className="flex gap-2 md:gap-3 items-center">
          <button
            onClick={toggleTheme}
            className="p-2 md:px-3 md:py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-all shadow-sm flex items-center justify-center"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

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

          <button
            onClick={downloadPDF}
            disabled={isPdfGenerating}
            className="p-2 md:px-4 md:py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
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

      {/* Main Content */}
      <div className="flex flex-col md:flex-row h-full w-full pt-[60px] md:pt-[72px]">
        {/* Image Section */}
        <div className="relative flex items-center justify-center w-full h-[45%] sm:h-[50%] md:h-full md:w-[50%] lg:w-[55%] bg-slate-200 dark:bg-slate-950 p-4 sm:p-6 md:p-8 lg:p-12 z-10 transition-colors duration-700">
          <div className="relative aspect-square w-full h-auto max-h-full md:w-auto md:h-full md:max-w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl bg-slate-300 dark:bg-slate-800">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={currentIndex + (storyData?.id || 0)} // Forces animation on new story
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
                  e.target.src =
                    "https://placehold.co/600x600?text=Image+Not+Found";
                }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 shadow-inner rounded-2xl sm:rounded-3xl pointer-events-none" />
          </div>
        </div>

        {/* Text Section */}
        <div
          className={`relative w-full h-[55%] sm:h-[50%] md:h-full md:flex-1 bg-white dark:bg-slate-900 flex flex-col justify-between p-6 md:p-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-20 transition-colors duration-700`}
        >
          <div className="flex justify-center md:justify-start gap-1.5 mb-4">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-blue-500 dark:bg-blue-400" : "w-2 bg-slate-200 dark:bg-slate-700"}`}
              />
            ))}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.h2
                key={storyData?.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center md:text-left text-sm font-bold text-blue-500 mb-2 uppercase tracking-wider"
              >
                {storyData?.title}
              </motion.h2>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex + (storyData?.id || 0)}
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

          {isAudioLoading && (
            <div className="flex justify-center md:justify-start items-center gap-2 text-xs text-blue-500 font-bold uppercase tracking-widest animate-pulse py-2">
              <Loader2 size={12} className="animate-spin" /> Loading Audio...
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            {/* The Prev Button is now disabled if on the very first slide of the very first story */}
            <button
              onClick={handlePrev}
              disabled={isFirstSlideOverall}
              className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 disabled:opacity-30 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
              {currentIndex + 1} / {slides.length}
            </span>
            {/* The Next Button is now disabled if on the very last slide of the very last story */}
            <button
              onClick={handleNext}
              disabled={isLastSlideOverall}
              className={`p-4 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 disabled:opacity-50 hover:bg-blue-700 hover:scale-105 transition-all`}
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
