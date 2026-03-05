/**
 * Global Theme Configuration for the Landing Page
 * Completely light, whitish, minimal, with absolutely no dark colors or cyan.
 */

export const LANDING_THEME = {
  colors: {
    // Backgrounds
    background: {
      main: "bg-white",
      transparent: "bg-transparent",
    },
    // Typography Colors (Soft mid-tones to keep it light but readable)
    text: {
      heading: "text-stone-200", // Soft slate instead of dark
      subtitle: "text-stone-200", // Lighter gray for subtitles
      brand: "text-stone-200", // Neutral replacement for the brand blue
      light: "text-stone-200",
    },
    // Accents & Decorations
    accent: {
      brandBg: "bg-white",
      blurEffect: "bg-slate-200/40",
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
      container: "bg-white border border-slate-100 shadow-sm",
      text: "text-blue-800 text-xs font-bold uppercase tracking-wider",
    },
    button: {
      primary:
        "bg-slate-100 hover:bg-slate-200 text-blue-800 shadow-sm transition-all border border-slate-200",
      secondary:
        "bg-white text-blue-800 border border-slate-100 hover:bg-slate-50",
    },
  },
};

export default LANDING_THEME;
