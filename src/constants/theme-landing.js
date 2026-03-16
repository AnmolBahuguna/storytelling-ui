/**
 * Global Theme Configuration for the Landing Page
 * Now fully supporting both Light and Dark modes using Tailwind 'dark:' variants.
 */

export const LANDING_THEME = {
  colors: {
    // Backgrounds
    background: {
      main: "bg-white dark:bg-slate-950",
      transparent: "bg-transparent",
    },
    // Typography Colors
    text: {
      heading: "text-slate-900 dark:text-white",
      subtitle: "text-slate-600 dark:text-slate-300",
      brand: "text-blue-600 dark:text-blue-400",
      light: "text-slate-500 dark:text-slate-400",
    },
    // Accents & Decorations
    accent: {
      brandBg: "bg-blue-600 dark:bg-blue-500",
      blurEffect: "bg-slate-200/40 dark:bg-slate-800/40",
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
        "bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 shadow-sm",
      text: "text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider",
    },
    button: {
      primary:
        "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-sm transition-all border border-transparent",
      secondary:
        "bg-white dark:bg-slate-800 text-blue-600 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700",
    },
  },
};

export default LANDING_THEME;
