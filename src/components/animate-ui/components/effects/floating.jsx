import React from "react";
import { motion } from "framer-motion";

const Floating = ({
  children,
  distance = 10,
  duration = 4,
  delay = 0,
  className = "",
  ...props
}) => (
  <motion.div
    animate={{ y: [0, -distance, 0] }}
    transition={{
      delay,
      duration,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export default Floating;
