import { motion } from "framer-motion";
import { Flame, Heart } from "lucide-react";

interface StreakCounterProps {
  streak: number;
}

export const StreakCounter = ({ streak }: StreakCounterProps) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
      className="bg-white dark:bg-neu-800 rounded-3xl p-8 shadow-neu-light dark:shadow-neu-dark mb-8 text-center relative overflow-hidden group hover:scale-105 transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <Flame className="w-12 h-12 text-orange-500" />
            <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
          <motion.span
            key={streak}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="text-6xl font-bold text-primary-500 relative"
          >
            {streak}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.span>
        </div>

        <h2 className="text-2xl font-bold text-neu-800 dark:text-neu-50 mb-2 group-hover:text-orange-500 transition-colors duration-300">
          Day Streak! 🔥
        </h2>
        <p className="text-neu-600 dark:text-neu-300">
          {streak === 0
            ? "Let's start your healthy journey!"
            : `You're on fire! Keep it up, gorgeous! 💕`}
        </p>

        {/* Enhanced Progress Ring */}
        <div className="mt-6">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-neu-200 dark:text-neu-700"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: Math.min(streak / 30, 1) }}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{
                  strokeDasharray: "351.86",
                  strokeDashoffset: `${
                    351.86 * (1 - Math.min(streak / 30, 1))
                  }`,
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f24ff0" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-8 h-8 text-primary-500" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
