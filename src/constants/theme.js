export const COLORS = {
  primary: {
    DEFAULT: "bg-yellow-400",
    hover: "hover:bg-yellow-500",
    text: "text-yellow-700",
    border: "border-yellow-400",
    ring: "focus:ring-yellow-400",
    shadow: "shadow-yellow-200",
  },
  secondary: {
    DEFAULT: "bg-blue-500",
    hover: "hover:bg-blue-600",
    text: "text-blue-500",
    light: "bg-blue-50",
    border: "border-blue-500",
  },
  background: {
    main: "bg-gray-50",
    card: "bg-white",
    input: "bg-gray-100",
  },
  text: {
    main: "text-gray-800",
    sub: "text-gray-500",
    placeholder: "placeholder-gray-300",
    dark: "text-slate-900",
  },
  border: {
    default: "border-gray-200",
    focus: "focus:border-yellow-400",
  },
};

export const FONTS = {
  main: "font-sans",
  heading: "font-bold tracking-tight",
};

export const STYLES = {
  card: "rounded-[40px] shadow-xl shadow-gray-200/50 p-8 md:p-12 relative overflow-hidden",
  button: {
    primary:
      "text-black font-bold px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed",
    secondary:
      "px-8 py-4 rounded-full font-bold text-gray-500 hover:bg-gray-200 transition-all",
    icon: "p-4 rounded-full transition-all",
  },
  input:
    "w-full bg-gray-100 hover:bg-gray-50 focus:bg-white text-center text-2xl font-bold py-5 px-6 rounded-3xl outline-none border-2 border-transparent focus:border-yellow-400 transition-all placeholder-gray-300",
};
