import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`
        relative w-16 h-8 rounded-full p-1 transition-colors duration-300
        ${isDark ? "bg-neu-700" : "bg-primary-200"}
      `}
    >
      <motion.div
        layout
        className={`
          w-6 h-6 rounded-full flex items-center justify-center text-xs
          ${isDark ? "bg-neu-100 text-neu-800" : "bg-white text-primary-600"}
        `}
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </motion.div>
    </motion.button>
  );
};
