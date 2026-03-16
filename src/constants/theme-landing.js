/**
 * Global Theme Configuration for the Landing Page
 * Supports both Light and Dark modes using Tailwind's 'dark:' classes.
 */

export const LANDING_THEME = {
  colors: {
    // Backgrounds
    background: {
      main: "bg-white dark:bg-transparent", // Dark mode gradient handled by wrapper
      transparent: "bg-transparent",
    },
    // Typography Colors
    text: {
      heading: "text-slate-900 dark:text-stone-200",
      subtitle: "text-slate-600 dark:text-slate-300",
      brand: "text-[#2b7fff] dark:text-blue-400",
      light: "text-slate-500 dark:text-stone-400",
    },
    // Accents & Decorations
    accent: {
      brandBg: "bg-[#2b7fff] dark:bg-slate-800",
      blurEffect: "bg-slate-200/40 dark:bg-blue-900/40",
    },
  },

  typography: {
    family: {
      main: "font-sans",
    },
    weight: {
      heading: "font-[800]",
      subtitle: "font-medium",
      bold: "font-bold",
    },
    size: {
      h1: "text-[40px] md:text-[64px]",
      h2: "text-3xl md:text-4xl",
      subtitle: "text-lg md:text-xl",
    },
  },

  // Specific UI Component Styles
  components: {
    badge: {
      container:
        "bg-blue-50 dark:bg-white/10 border border-blue-100 dark:border-white/20 shadow-sm backdrop-blur-md",
      text: "text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider",
    },
    button: {
      primary:
        "bg-[#2b7fff] hover:bg-blue-600 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-blue-900 shadow-md transition-all border border-transparent",
      secondary:
        "bg-white dark:bg-slate-800/50 text-[#2b7fff] dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 backdrop-blur-sm transition-all",
    },
  },
};

export default LANDING_THEME;
