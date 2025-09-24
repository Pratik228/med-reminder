"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { useMedicationReminders } from "@/hooks/useMedicationReminders";
import { LoginPage } from "./LoginPage";
import { LogoutButton } from "./LogoutButton";

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppContent = ({ children }: AppWrapperProps) => {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  // Initialize medication reminders hook (this will start the reminder checking)
  useMedicationReminders();

  useEffect(() => {
    if (!loading && !user) {
      setShowLogin(true);
    } else if (user) {
      setShowLogin(false);
    }
  }, [user, loading]);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-neu-900 dark:via-neu-800 dark:to-neu-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Logout Button - Only show when logged in */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50"
        >
          <LogoutButton />
        </motion.div>
      )}

      {/* Main App or Login Page */}
      <AnimatePresence mode="wait">
        {showLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <LoginPage onLogin={() => setShowLogin(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AppWrapper = ({ children }: AppWrapperProps) => {
  return (
    <Provider store={store}>
      <AppContent>{children}</AppContent>
    </Provider>
  );
};
