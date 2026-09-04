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
  HelpCircle,
  CheckCircle2,
  XCircle,
  Trophy,
  Volume2,
} from "lucide-react";
import jsPDF from "jspdf";
import { toJpeg } from "html-to-image";
import confetti from "canvas-confetti";

const SERVER_URL =
  import.meta && import.meta.env && import.meta.env.VITE_SERVER_URL
    ? import.meta.env.VITE_SERVER_URL
    : "";

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

  // --- INTERACTIVE FEATURES STATE ---
  const [activeGlossary, setActiveGlossary] = useState(null);
  
  // Challenge State
  const [solvedChallenges, setSolvedChallenges] = useState({}); // { slideIndex: true }
  const [selectedChallengeOption, setSelectedChallengeOption] = useState(null);
  
  // Quiz State
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizState, setQuizState] = useState({ currentQuestion: 0, score: 0, isComplete: false, selectedOption: null });

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
    if (!imagePath) return "https://loremflickr.com/1024/1024/cartoon,storybook/all?lock=1";
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
    setSolvedChallenges({});
    setShowQuiz(false);
    setQuizState({ currentQuestion: 0, score: 0, isComplete: false, selectedOption: null });
  }, [storyData]);

  // Reset challenge option when slide changes
  useEffect(() => {
    setSelectedChallengeOption(null);
    setActiveGlossary(null);
  }, [currentIndex]);

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
    // Users can now proceed to the next slide even if they haven't solved the challenge
    if (currentIndex < slides.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else if (storyData?.quiz && storyData.quiz.length > 0 && !showQuiz) {
      // Show quiz instead of ending story
      setShowQuiz(true);
    } else if (playlist && playlistIndex < playlist.stories.length - 1) {
      // Jump to next story in playlist
      setDirection(1);
      const nextStoryIdx = playlistIndex + 1;
      setPlaylistIndex(nextStoryIdx);
      setStoryData(playlist.stories[nextStoryIdx]);
      setShowQuiz(false);
    }
  };
  const handlePrev = () => {
    if (showQuiz) {
      setShowQuiz(false);
      return;
    }

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
    try {
      // We use a fixed aspect ratio for crisp pages
      const pdfWidth = 800;
      const pdfHeight = 1000;
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [pdfWidth, pdfHeight]
      });

      // Create a hidden rendering container safely
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = `${pdfWidth}px`;
      container.style.backgroundColor = isDarkMode ? "#0f172a" : "#ffffff";
      container.style.color = isDarkMode ? "#f8fafc" : "#0f172a";
      // This ensures whatever language font the browser uses is applied natively
      container.style.fontFamily = "system-ui, -apple-system, sans-serif"; 
      document.body.appendChild(container);

      // Loop through all slides and paint them to canvases
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        
        // Build slide wrapper
        const slideDiv = document.createElement("div");
        slideDiv.style.width = `${pdfWidth}px`;
        slideDiv.style.height = `${pdfHeight}px`;
        slideDiv.style.display = "flex";
        slideDiv.style.flexDirection = "column";
        slideDiv.style.padding = "60px";
        slideDiv.style.boxSizing = "border-box";
        
        // Title (Only on first page)
        if (i === 0 && storyData?.title) {
          const titleDiv = document.createElement("h1");
          titleDiv.style.fontSize = "42px";
          titleDiv.style.textAlign = "center";
          titleDiv.style.color = "#3b82f6";
          titleDiv.style.marginBottom = "30px";
          titleDiv.innerText = storyData.title;
          slideDiv.appendChild(titleDiv);
        }
        
        // Image Container
        const imgContainer = document.createElement("div");
        imgContainer.style.width = "100%";
        // Adjust height if there is a title
        imgContainer.style.height = i === 0 && storyData?.title ? "500px" : "600px";
        imgContainer.style.borderRadius = "24px";
        imgContainer.style.overflow = "hidden";
        imgContainer.style.marginBottom = "40px";
        imgContainer.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)";
        
        // Need to load image with anonymous CORS so canvas isn't tainted
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        
        // Set cache-buster to prevent CORS issues if the image was already loaded without CORS earlier
        const urlToFetch = getImageUrl(slide.image);
        const urlWithCacheBuster = urlToFetch.includes('?') 
          ? `${urlToFetch}&disableCache=${Date.now()}` 
          : `${urlToFetch}?disableCache=${Date.now()}`;
        
        // Create a promise to wait for image physical loading
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = () => {
             console.warn("Failed to natively load image via CORS fallback:", urlToFetch);
             resolve();
          };
          img.src = urlWithCacheBuster;
        });
        
        imgContainer.appendChild(img);
        
        // Narrative Text
        const textDiv = document.createElement("div");
        textDiv.style.fontSize = "36px";
        textDiv.style.lineHeight = "1.5";
        textDiv.style.textAlign = "center";
        textDiv.style.fontWeight = "600";
        // Browser natively resolves the correct font glyphs for any language here!
        textDiv.innerText = slide.text; 
        
        // Page numbering
        const pageNum = document.createElement("div");
        pageNum.style.marginTop = "auto";
        pageNum.style.textAlign = "center";
        pageNum.style.fontSize = "18px";
        pageNum.style.color = "#94a3b8";
        pageNum.innerText = `${i + 1} / ${slides.length}`;
        
        slideDiv.appendChild(imgContainer);
        slideDiv.appendChild(textDiv);
        slideDiv.appendChild(pageNum);
        
        // --- Added StoryAI Watermark ---
        const watermark = document.createElement("div");
        watermark.innerText = "StoryAI";
        watermark.style.position = "absolute";
        watermark.style.bottom = "30px"; // Place securely inside bounding box
        watermark.style.right = "40px";
        watermark.style.fontSize = "36px";
        watermark.style.fontWeight = "900";
        watermark.style.fontFamily = "system-ui, -apple-system, sans-serif";
        watermark.style.color = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
        watermark.style.pointerEvents = "none"; // Make sure it interferes with nothing
        watermark.style.userSelect = "none";
        
        // Ensure the parent container can host the absolute positioned watermark safely
        slideDiv.style.position = "relative";
        slideDiv.appendChild(watermark);
        
        container.innerHTML = '';
        container.appendChild(slideDiv);
        
        // Snapshot the HTML node into an image using html-to-image
        // This leverages native SVG rendering bounding, bypassing strict CSS parser bugs (like oklch)
        const imgData = await toJpeg(slideDiv, {
          quality: 0.95,
          pixelRatio: 2, // 2x resolution for crispness
          backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
          // Avoid trying to fetch external fonts if they cause issues
          skipFonts: true, 
        });
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      
      // Cleanup DOM
      document.body.removeChild(container);
      
      // Save PDF to user
      const safeTitle = (storyData?.title || 'Story').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      pdf.save(`${safeTitle}.pdf`);
      
    } catch (error) {
      console.error("PDF generation failed EXCEPTION:", error);
      alert(`Error generating PDF: ${error.message}`);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // --- INTERACTIVE HELPERS ---
  const renderTextWithGlossary = (text) => {
    if (!storyData?.glossary || storyData.glossary.length === 0) return text;
    
    let parts = [{ text, isWord: false }];
    
    storyData.glossary.forEach(item => {
      const newParts = [];
      // Use word boundary to avoid partial matches
      const regex = new RegExp(`\\b(${item.word})\\b`, "gi");
      
      parts.forEach(part => {
        if (part.isWord) {
          newParts.push(part);
          return;
        }
        
        const splitText = part.text.split(regex);
        splitText.forEach(segment => {
          if (segment.toLowerCase() === item.word.toLowerCase()) {
            newParts.push({ text: segment, isWord: true, item });
          } else if (segment) {
            newParts.push({ text: segment, isWord: false });
          }
        });
      });
      parts = newParts;
    });

    return parts.map((part, i) => 
      part.isWord ? (
        <span 
          key={i} 
          onClick={() => {
            setActiveGlossary(part.item);
            if (isPlaying) {
              setIsAutoPlaying(false);
              audioRef.current.pause();
            }
          }}
          className="text-violet-500 border-b-2 border-dashed border-violet-300 cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors font-extrabold relative inline-block group"
          title="Click to learn this word!"
        >
          {part.text}
          <span className="absolute -top-1 -right-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
        </span>
      ) : (
        <span key={i}>{part.text}</span>
      )
    );
  };

  const handleChallengeSubmit = (option) => {
    setSelectedChallengeOption(option);
    if (option === currentSlide.challenge.correct_answer) {
      setSolvedChallenges(prev => ({ ...prev, [currentIndex]: true }));
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#7C3AED', '#F59E0B', '#34D399']
      });
    }
  };

  const handleQuizSubmit = (option) => {
    if (quizState.selectedOption) return; // Already answered
    
    const isCorrect = option === storyData.quiz[quizState.currentQuestion].correct_answer;
    
    setQuizState(prev => ({ ...prev, selectedOption: option }));
    
    if (isCorrect) {
      setQuizState(prev => ({ ...prev, score: prev.score + 1 }));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#F59E0B']
      });
    }

    setTimeout(() => {
      if (quizState.currentQuestion < storyData.quiz.length - 1) {
        setQuizState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          selectedOption: null
        }));
      } else {
        setQuizState(prev => ({ ...prev, isComplete: true, selectedOption: null }));
        if (prevScore => prevScore + (isCorrect ? 1 : 0) === storyData.quiz.length) {
          // Perfect score confetti!
          confetti({
            particleCount: 300,
            spread: 120,
            origin: { y: 0.5 },
          });
        }
      }
    }, 2500); // Wait 2.5 seconds to show explanation before moving on
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
      className={`story-viewer-page fixed inset-0 w-full h-full flex flex-col font-sans overflow-hidden transition-colors duration-700 ${isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}
    >
      {/* Header */}
      <div className="story-viewer-header absolute top-0 left-0 right-0 z-50 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/20 shadow-sm transition-colors duration-700">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="hidden md:inline font-bold text-sm">
              Home
            </span>
          </Link>
          
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-violet-600 dark:text-violet-400 font-bold transition-colors shadow-sm"
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

      {/* Glossary Popup Modal */}
      <AnimatePresence>
        {activeGlossary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setActiveGlossary(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border-4 border-violet-100 dark:border-slate-700 relative text-center"
            >
              <button 
                onClick={() => setActiveGlossary(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <XCircle size={24} />
              </button>
              
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle size={32} className="text-amber-500" />
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {activeGlossary.word}
              </h3>
              
              <div className="flex items-center justify-center gap-2 text-violet-500 font-bold mb-6">
                <Volume2 size={16} />
                <span>/{activeGlossary.pronunciation}/</span>
              </div>
              
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl">
                {activeGlossary.explanation}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="story-viewer-content flex flex-col md:flex-row h-full w-full pt-[60px] md:pt-[72px]">
        {/* Image Section */}
        <div className="story-viewer-image relative flex items-center justify-center w-full h-[45%] sm:h-[50%] md:h-full md:w-[50%] lg:w-[55%] bg-slate-200 dark:bg-slate-950 p-4 sm:p-6 md:p-8 lg:p-12 z-10 transition-colors duration-700">
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
                    `https://loremflickr.com/1024/1024/cartoon,storybook,illustration/all?lock=${currentIndex + 50}`;
                }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 shadow-inner rounded-2xl sm:rounded-3xl pointer-events-none" />
          </div>
        </div>

        {/* Text Section */}
        <div
          className={`story-viewer-text relative w-full h-[55%] sm:h-[50%] md:h-full md:flex-1 bg-white dark:bg-slate-900 flex flex-col justify-between p-6 md:p-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-20 transition-colors duration-700`}
        >
          <div className="flex justify-center md:justify-start gap-1.5 mb-4">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-8 bg-violet-500 dark:bg-violet-400" : "w-2 bg-slate-200 dark:bg-slate-700"}`}
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
                className="text-center md:text-left text-sm font-bold text-violet-500 mb-2 uppercase tracking-wider"
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
                {renderTextWithGlossary(currentSlide.text)}
              </motion.p>
            </AnimatePresence>

            {/* MINI CHALLENGE UI */}
            <AnimatePresence>
              {currentSlide.challenge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-5 bg-gradient-to-br from-amber-50 to-violet-50 dark:from-slate-800 dark:to-slate-800/80 rounded-2xl border-2 border-violet-100 dark:border-slate-700 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
                    <Trophy size={48} className="text-amber-500" />
                  </div>
                  <h4 className="font-bold text-violet-600 dark:text-violet-400 mb-3 flex items-center gap-2">
                    <HelpCircle size={18} /> Mini Challenge!
                  </h4>
                  <p className="text-slate-800 dark:text-slate-200 font-medium mb-4">
                    {currentSlide.challenge.question}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentSlide.challenge.options.map((option, idx) => {
                      const isSelected = selectedChallengeOption === option;
                      const isCorrect = option === currentSlide.challenge.correct_answer;
                      const hasAnswered = selectedChallengeOption !== null;
                      
                      let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-violet-300";
                      
                      if (hasAnswered) {
                        if (isCorrect) btnClass = "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold";
                        else if (isSelected) btnClass = "bg-red-100 dark:bg-red-900/40 border-red-500 text-red-800 dark:text-red-300";
                        else btnClass = "opacity-50 border-slate-200";
                      }
                      
                      return (
                        <button
                          key={idx}
                          disabled={hasAnswered && isCorrect}
                          onClick={() => handleChallengeSubmit(option)}
                          className={`p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between ${btnClass}`}
                        >
                          <span>{option}</span>
                          {hasAnswered && isCorrect && <CheckCircle2 size={18} className="text-emerald-500" />}
                          {hasAnswered && isSelected && !isCorrect && <XCircle size={18} className="text-red-500" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isAudioLoading && (
            <div className="flex justify-center md:justify-start items-center gap-2 text-xs text-violet-500 font-bold uppercase tracking-widest animate-pulse py-2">
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
              disabled={isLastSlideOverall && (!storyData?.quiz || storyData.quiz.length === 0) || (currentSlide.challenge && !solvedChallenges[currentIndex])}
              className={`p-4 rounded-full ${currentSlide.challenge && !solvedChallenges[currentIndex] ? 'bg-slate-200 dark:bg-slate-700 text-slate-400' : 'bg-violet-600 text-white shadow-lg shadow-violet-500/30 hover:bg-violet-700 hover:scale-105'} transition-all`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* END OF STORY QUIZ OVERLAY */}
      <AnimatePresence>
        {showQuiz && storyData?.quiz && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            className="fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col pt-20 pb-6 px-4 md:px-8 overflow-y-auto"
          >
            <div className="max-w-2xl w-full mx-auto flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <Trophy className="text-amber-500" size={32} />
                  Story Quiz Time!
                </h2>
                {!quizState.isComplete && (
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setShowQuiz(false)}
                      className="text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full"
                    >
                      Skip Quiz
                    </button>
                    <div className="text-sm font-bold text-violet-500 bg-violet-50 dark:bg-violet-900/30 px-4 py-2 rounded-full hidden sm:block">
                      Question {quizState.currentQuestion + 1} of {storyData.quiz.length}
                    </div>
                  </div>
                )}
              </div>

              {quizState.isComplete ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="w-32 h-32 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                    <Trophy size={64} className="text-amber-500" />
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
                    You scored {quizState.score} out of {storyData.quiz.length}!
                  </h3>
                  <p className="text-xl text-slate-600 dark:text-slate-300">
                    {quizState.score === storyData.quiz.length 
                      ? "Perfect! You're a story master! 🌟" 
                      : "Great job! Keep reading and learning! 📚"}
                  </p>
                  
                  <div className="pt-8 flex gap-4">
                    <button
                      onClick={() => setShowQuiz(false)}
                      className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Back to Story
                    </button>
                    {playlist && playlistIndex < playlist.stories.length - 1 && (
                      <button
                        onClick={() => {
                          setDirection(1);
                          const nextStoryIdx = playlistIndex + 1;
                          setPlaylistIndex(nextStoryIdx);
                          setStoryData(playlist.stories[nextStoryIdx]);
                          setShowQuiz(false);
                        }}
                        className="px-8 py-4 bg-violet-600 text-white font-bold rounded-full hover:bg-violet-700 shadow-lg shadow-violet-500/30 transition-colors"
                      >
                        Next Story
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 md:p-10 mb-8 border-2 border-slate-100 dark:border-slate-700">
                    <h3 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
                      {storyData.quiz[quizState.currentQuestion].question}
                    </h3>
                    
                    <div className="space-y-3">
                      {storyData.quiz[quizState.currentQuestion].options.map((option, idx) => {
                        const isSelected = quizState.selectedOption === option;
                        const isCorrect = option === storyData.quiz[quizState.currentQuestion].correct_answer;
                        const hasAnswered = quizState.selectedOption !== null;
                        
                        let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-violet-300 hover:shadow-md";
                        
                        if (hasAnswered) {
                          if (isCorrect) btnClass = "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold scale-[1.02]";
                          else if (isSelected) btnClass = "bg-red-100 dark:bg-red-900/40 border-red-500 text-red-800 dark:text-red-300 scale-95 opacity-50";
                          else btnClass = "opacity-50 border-slate-200";
                        }
                        
                        return (
                          <button
                            key={idx}
                            disabled={hasAnswered}
                            onClick={() => handleQuizSubmit(option)}
                            className={`w-full p-4 md:p-6 rounded-2xl border-2 text-left transition-all duration-300 flex items-center justify-between text-lg font-medium ${btnClass}`}
                          >
                            <span>{option}</span>
                            {hasAnswered && isCorrect && <CheckCircle2 size={24} className="text-emerald-500" />}
                            {hasAnswered && isSelected && !isCorrect && <XCircle size={24} className="text-red-500" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Explanation popup that appears after answering */}
                  <AnimatePresence>
                    {quizState.selectedOption && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 dark:bg-slate-800 p-6 rounded-2xl border-2 border-amber-200 dark:border-slate-700 flex gap-4 items-start"
                      >
                        <div className="bg-amber-100 dark:bg-slate-700 p-2 rounded-full shrink-0">
                          <Sparkles className="text-amber-500" size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white mb-1">Did you know?</h4>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {storyData.quiz[quizState.currentQuestion].explanation}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryViewer;
