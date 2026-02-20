// 🌟 Kid-Friendly Blue Theme
export const COLORS = {
  background: {
    main: "bg-sky-100",
    card: "bg-white",
    input: "bg-sky-50",
  },
  primary: {
    DEFAULT: "bg-blue-500",
    hover: "hover:bg-blue-600",
    text: "text-blue-600",
    border: "border-blue-400",
    shadow: "shadow-blue-300",
  },
  text: {
    main: "text-blue-900",
    sub: "text-blue-500",
    placeholder: "placeholder-blue-300",
  },
  border: {
    default: "border-blue-100",
    focus: "focus:border-blue-400",
  },
};

export const FONTS = {
  main: "font-['Nunito',_sans-serif]",
  heading: "font-['Nunito',_sans-serif] font-extrabold",
};

export const STYLES = {
  card: "rounded-3xl shadow-xl border-2 border-blue-100 p-8",
  button: {
    primary:
      "flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-white text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
    secondary:
      "flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-blue-400 bg-blue-50 border-2 border-blue-200 text-base transition-all duration-200 hover:bg-blue-100 hover:scale-105 active:scale-95",
  },
};