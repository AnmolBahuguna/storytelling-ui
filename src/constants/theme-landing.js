/**
 * Global Theme Configuration for the Landing Page
 * Supports both Light and Dark modes using Tailwind's 'dark:' classes.
 * 
 * 🎨 "Magical Storybook" palette — warm, inviting, kid-friendly
 *    Primary:   Purple (#7C3AED) — magical, dreamy
 *    Secondary: Amber (#F59E0B) — friendly, inviting
 *    Accent:    Teal (#06B6D4) — playful energy
 */

export const LANDING_THEME = {
  colors: {
    // Backgrounds
    background: {
      main: "bg-white bg-no-repeat bg-top bg-cover",
      dark: "bg-gradient-to-b from-[#07052d] via-[#17104b] to-[#09052b] bg-no-repeat bg-top bg-cover",
      transparent: "bg-transparent",
    },
    // Typography Colors
    text: {
      heading: "text-[#173B4D] dark:text-amber-50",
      subtitle: "text-[#294B58] dark:text-slate-300",
      brand: "text-sky-600 dark:text-sky-400",
      light: "text-[#355361] dark:text-stone-400",
    },
    // Accents & Decorations
    accent: {
      brandBg: "bg-[#ff7043] dark:bg-[#ff7043]",
      blurEffect: "bg-sky-200/40 dark:bg-[#0EA5E9]/20",
    },
  },

  typography: {
    family: {
      main: "font-[Nunito]",
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
        "bg-sky-50 dark:bg-white/10 border border-sky-200 dark:border-white/20 shadow-sm backdrop-blur-md",
      text: "text-sky-700 dark:text-sky-300 text-xs font-bold uppercase tracking-wider",
    },
    button: {
      primary:
        "bg-[#ff7043] hover:bg-[#ff8a5c] dark:bg-[#ff7043] dark:hover:bg-[#ff8a5c] text-white dark:text-white shadow-md shadow-[#ff7043]/30 transition-all border border-transparent",
      secondary:
        "bg-white dark:bg-slate-800/50 text-sky-600 dark:text-white border border-sky-200 dark:border-slate-700 hover:bg-sky-50 dark:hover:bg-slate-800 backdrop-blur-sm transition-all",
    },
  },
};

export default LANDING_THEME;
