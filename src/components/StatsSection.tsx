"use client";
import { motion } from "framer-motion";
import { Flame, Target, Zap, Sun, Moon } from "lucide-react";

interface StatsSectionProps {
  isDark: boolean;
  onToggleTheme: () => void;
  streak: number;
  compliance: number;
  weeklyCount: number;
}

export default function StatsSection({
  isDark,
  onToggleTheme,
  streak,
  compliance,
  weeklyCount,
}: StatsSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="space-y-8 relative z-10"
    >
      {/* Dark Mode Card */}
      <motion.button
        className="neu p-10 text-center hover:neu-pressed transition-all duration-300 rounded-2xl group relative overflow-hidden w-full"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggleTheme}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <div className="neu-inset p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 relative">
            <motion.div
              animate={{ rotate: isDark ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? (
                <Sun className="w-8 h-8 text-yellow-500 mx-auto" />
              ) : (
                <Moon className="w-8 h-8 text-blue-500 mx-auto" />
              )}
            </motion.div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/20 to-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="text-lg font-semibold text-neu-700 dark:text-neu-300 group-hover:text-yellow-500 dark:group-hover:text-blue-500 transition-colors duration-300">
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>
          <p className="text-sm text-neu-500 dark:text-neu-400 mt-1">
            Switch theme
          </p>
        </div>
      </motion.button>

      {/* Streak Card */}
      <motion.div
        className="neu p-10 text-center rounded-2xl relative overflow-visible group hover:scale-105 transition-all duration-300 z-20"
        whileHover={{ y: -5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <motion.div
            className="neu-inset p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center relative"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Flame className="w-8 h-8 text-orange-500" />
            <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
          <motion.div
            className="text-3xl font-bold text-orange-500 mb-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {streak}
          </motion.div>
          <div className="text-sm text-neu-600 dark:text-neu-400 font-medium">
            Streak Days
          </div>
          <div className="text-xs text-neu-500 dark:text-neu-500 mt-1">
            Keep it up! 🔥
          </div>
        </div>
      </motion.div>

      {/* Compliance Card */}
      <motion.div
        className="neu p-10 text-center rounded-2xl relative overflow-visible group hover:scale-105 transition-all duration-300 z-20"
        whileHover={{ y: -5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <motion.div
            className="neu-inset p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center relative"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Target className="w-8 h-8 text-green-500" />
            <div className="absolute inset-0 rounded-full bg-green-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
          <motion.div
            className="text-3xl font-bold text-green-500 mb-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            {compliance}%
          </motion.div>
          <div className="text-sm text-neu-600 dark:text-neu-400 font-medium">
            Compliance
          </div>
          <div className="text-xs text-neu-500 dark:text-neu-500 mt-1">
            Excellent! 🎯
          </div>
        </div>
      </motion.div>

      {/* Weekly Progress Card */}
      <motion.div
        className="neu p-10 text-center rounded-2xl relative overflow-visible group hover:scale-105 transition-all duration-300 z-20"
        whileHover={{ y: -5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10">
          <motion.div
            className="neu-inset p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center relative"
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Zap className="w-8 h-8 text-purple-500" />
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
          <motion.div
            className="text-3xl font-bold text-purple-500 mb-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            {weeklyCount}
          </motion.div>
          <div className="text-sm text-neu-600 dark:text-neu-400 font-medium">
            This Week
          </div>
          <div className="text-xs text-neu-500 dark:text-neu-500 mt-1">
            On track! ⚡
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
