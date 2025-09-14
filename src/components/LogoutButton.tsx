"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Settings, Heart } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export const LogoutButton = () => {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        className="neu p-3 rounded-2xl hover:neu-pressed transition-all duration-200 group relative overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        <div className="relative z-10 flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <User className="w-4 h-4 text-neu-600 dark:text-neu-400" />
        </div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 neu rounded-2xl p-2 shadow-xl z-50"
          >
            {/* User Info */}
            <div className="p-4 border-b border-neu-200 dark:border-neu-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neu-800 dark:text-neu-200 truncate">
                    {user?.email || "User"}
                  </p>
                  <p className="text-sm text-neu-500 dark:text-neu-400">
                    {user?.isAnonymous ? "Guest User" : "Registered User"}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <motion.button
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:neu-pressed rounded-xl transition-all duration-200 group"
                whileHover={{ x: 4 }}
              >
                <Settings className="w-5 h-5 text-neu-500 group-hover:text-primary-500 transition-colors duration-200" />
                <span className="text-neu-700 dark:text-neu-300 group-hover:text-primary-500 transition-colors duration-200">
                  Settings
                </span>
              </motion.button>

              <motion.button
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:neu-pressed rounded-xl transition-all duration-200 group"
                whileHover={{ x: 4 }}
              >
                <Heart className="w-5 h-5 text-neu-500 group-hover:text-red-500 transition-colors duration-200" />
                <span className="text-neu-700 dark:text-neu-300 group-hover:text-red-500 transition-colors duration-200">
                  About MedLove
                </span>
              </motion.button>

              <div className="border-t border-neu-200 dark:border-neu-700 my-2"></div>

              <motion.button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:neu-pressed rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ x: 4 }}
              >
                {isLoggingOut ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full"
                  />
                ) : (
                  <LogOut className="w-5 h-5 text-red-500" />
                )}
                <span className="text-red-600 dark:text-red-400 font-medium">
                  {isLoggingOut ? "Signing Out..." : "Sign Out"}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
