"use client";
import {
  Heart,
  Pill,
  Bell,
  Plus,
  Calendar,
  X,
  Check,
  Sparkles,
  Star,
  Zap,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import TodaysReminders from "@/components/TodaysReminders";
import StatsSection from "@/components/StatsSection";
import { AddMedicationForm } from "@/components/AddMedicationForm";
import { useMedications } from "@/hooks/useMedications";
import { useAuth } from "@/hooks/useAuth";
import { useStats } from "@/hooks/useStats";
import { AppWrapper } from "@/components/AppWrapper";

export default function Home() {
  const { loading: authLoading } = useAuth();
  const {
    medications,
    loading: medicationsLoading,
    toggleMedicationTaken,
  } = useMedications();

  const [isDark, setIsDark] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting and theme initialization
  useEffect(() => {
    setMounted(true);
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    if (shouldBeDark) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Get real stats from hook
  const { streak, compliance, weeklyCount, todayCompleted, todayTotal } =
    useStats();

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const toggleMedication = async (id: string) => {
    try {
      const medication = medications.find((med) => med.id === id);
      if (medication) {
        await toggleMedicationTaken(id);
      }
    } catch (error) {
      console.error("Error toggling medication:", error);
    }
  };

  const addMedication = () => {
    setShowAddModal(true);
  };

  const showScheduleView = () => {
    setShowScheduleModal(true);
  };

  // Show loading state
  if (authLoading || medicationsLoading || !mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neu-50 via-white to-neu-100 dark:from-neu-900 dark:via-neu-800 dark:to-neu-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <AppWrapper>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDark
            ? "bg-gradient-to-br from-neu-900 via-neu-800 to-neu-900"
            : "bg-gradient-to-br from-neu-50 via-white to-neu-100"
        }`}
      >
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div
            className="absolute top-40 right-32 w-24 h-24 bg-secondary-500 rounded-full blur-2xl opacity-15 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-3xl opacity-10 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-20 h-20 bg-accent-500 rounded-full blur-2xl opacity-20 animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        <div className="relative z-10 p-4">
          {/* Enhanced Header */}
          <header className="text-center mb-16 relative">
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", damping: 20 }}
              className="neu p-12 w-full rounded-3xl relative overflow-hidden"
            >
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/5 to-accent-500/10 rounded-3xl"></div>

              {/* Animated background elements */}
              <div className="absolute top-4 left-8 w-20 h-20 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-2xl animate-pulse"></div>
              <div
                className="absolute top-8 right-12 w-16 h-16 bg-gradient-to-r from-secondary-500/20 to-accent-500/20 rounded-full blur-xl animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute bottom-6 left-1/4 w-12 h-12 bg-gradient-to-r from-accent-500/20 to-primary-500/20 rounded-full blur-lg animate-pulse"
                style={{ animationDelay: "2s" }}
              ></div>

              <div className="relative z-10">
                {/* Left side decorative elements */}
                <div className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="space-y-4"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="neu-inset p-3 rounded-2xl w-fit"
                    >
                      <Sparkles className="w-6 h-6 text-primary-500" />
                    </motion.div>
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                      className="neu-inset p-3 rounded-2xl w-fit"
                    >
                      <Star className="w-6 h-6 text-secondary-500" />
                    </motion.div>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 15, -15, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                      className="neu-inset p-3 rounded-2xl w-fit"
                    >
                      <Zap className="w-6 h-6 text-accent-500" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Right side decorative elements */}
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="space-y-4"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="neu-inset p-3 rounded-2xl w-fit"
                    >
                      <Shield className="w-6 h-6 text-accent-500" />
                    </motion.div>
                    <motion.div
                      animate={{
                        y: [0, 10, 0],
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.8,
                      }}
                      className="neu-inset p-3 rounded-2xl w-fit"
                    >
                      <Heart className="w-6 h-6 text-primary-500" />
                    </motion.div>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -15, 15, 0],
                      }}
                      transition={{
                        duration: 4.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.2,
                      }}
                      className="neu-inset p-3 rounded-2xl w-fit"
                    >
                      <Bell className="w-6 h-6 text-secondary-500" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Main content */}
                <div className="flex items-center justify-center mb-8">
                  <motion.div
                    className="neu-inset p-8 rounded-full relative group"
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 15, -15, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Pill className="w-12 h-12 text-primary-500 group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                    {/* Enhanced glow effect */}
                    <div className="absolute inset-0 rounded-full bg-primary-500/30 blur-2xl group-hover:bg-primary-500/50 transition-all duration-300"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                  </motion.div>
                </div>

                {/* Enhanced title with better typography */}
                <motion.h1
                  className="text-7xl font-black bg-gradient-to-r from-primary-500 via-secondary-500 via-accent-500 to-primary-500 bg-clip-text text-transparent mb-6 tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    opacity: { delay: 0.3, duration: 0.8 },
                    y: { delay: 0.3, duration: 0.8 },
                    backgroundPosition: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  }}
                  style={{ backgroundSize: "300% 100%" }}
                >
                  MedLove
                </motion.h1>

                {/* Enhanced subtitle with better typography */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="space-y-3"
                >
                  <p className="text-2xl font-semibold text-neu-700 dark:text-neu-200 mb-2 tracking-wide">
                    Your beautiful medication companion{" "}
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="inline-block"
                    >
                      💕
                    </motion.span>
                  </p>
                  <motion.p
                    className="text-lg text-neu-600 dark:text-neu-300 font-medium tracking-wide"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Stay healthy, stay consistent, stay amazing!
                  </motion.p>
                </motion.div>

                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-primary-500/30 rounded-full"
                      animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 100 - 50, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${80 + Math.random() * 20}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto space-y-8 px-4 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Today's Reminders Component - Left Side */}
              <div className="lg:col-span-1">
                <TodaysReminders
                  medications={medications}
                  onToggleMedication={toggleMedication}
                  completedCount={todayCompleted}
                  totalCount={todayTotal}
                />
              </div>

              {/* Action Buttons - Middle */}
              <div className="lg:col-span-1 space-y-6">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="neu p-10 text-center hover:neu-pressed transition-all duration-300 rounded-2xl group relative overflow-hidden w-full"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addMedication}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="neu-inset p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 relative">
                      <Plus className="w-8 h-8 text-primary-500 mx-auto" />
                      <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-lg font-semibold text-neu-700 dark:text-neu-300 group-hover:text-primary-500 transition-colors duration-300">
                      Add Medication
                    </span>
                    <p className="text-sm text-neu-500 dark:text-neu-400 mt-1">
                      Track new meds
                    </p>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="neu p-10 text-center hover:neu-pressed transition-all duration-300 rounded-2xl group relative overflow-hidden w-full"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={showScheduleView}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/10 to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="neu-inset p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 relative">
                      <Calendar className="w-8 h-8 text-secondary-500 mx-auto" />
                      <div className="absolute inset-0 rounded-full bg-secondary-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-lg font-semibold text-neu-700 dark:text-neu-300 group-hover:text-secondary-500 transition-colors duration-300">
                      Today&apos;s Schedule
                    </span>
                    <p className="text-sm text-neu-500 dark:text-neu-400 mt-1">
                      View timeline
                    </p>
                  </div>
                </motion.button>
              </div>

              {/* Stats Section - Right Side */}
              <div className="lg:col-span-1">
                <StatsSection
                  isDark={isDark}
                  onToggleTheme={toggleTheme}
                  streak={streak}
                  compliance={compliance}
                  weeklyCount={weeklyCount}
                />
              </div>
            </div>

            {/* Enhanced Floating Action Button */}
            <motion.div
              className="fixed bottom-24 right-8 z-50"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
            >
              <motion.button
                className="neu p-6 rounded-full hover:neu-pressed transition-all duration-300 animate-float relative overflow-hidden group"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={addMedication}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                <motion.div
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10"
                >
                  <Plus className="w-8 h-8 text-primary-500 group-hover:text-white transition-colors duration-300" />
                </motion.div>
                <div className="absolute inset-0 rounded-full bg-primary-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </motion.div>
          </main>

          {/* Enhanced Footer - Full Width Sticky to Bottom */}
          <motion.footer
            className="fixed bottom-0 left-0 right-0 z-40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="neu p-6 w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5"></div>
              <div className="relative z-10 text-center">
                <div className="text-neu-500 dark:text-neu-400 text-sm flex items-center justify-center">
                  Made with{" "}
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-block"
                  >
                    <Heart className="w-4 h-4 mx-1 text-red-500" />
                  </motion.span>
                  for better health
                </div>
                <p className="text-xs text-neu-400 dark:text-neu-500 mt-1">
                  Stay consistent, stay healthy! 💪
                </p>
              </div>
            </div>
          </motion.footer>

          {/* Enhanced Add Medication Modal */}
          <AnimatePresence>
            {showAddModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setShowAddModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.7, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.7, opacity: 0, y: 50 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="neu p-10 rounded-3xl max-w-2xl w-full relative overflow-hidden max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/5 to-accent-500/10 rounded-3xl"></div>

                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="neu-inset p-3 rounded-2xl">
                        <Pill className="w-6 h-6 text-primary-500" />
                      </div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                        Add Medication
                      </h3>
                    </div>
                    <motion.button
                      onClick={() => setShowAddModal(false)}
                      className="neu-inset p-3 rounded-2xl hover:neu-pressed transition-all duration-200 group"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5 text-neu-600 dark:text-neu-400 group-hover:text-red-500 transition-colors duration-200" />
                    </motion.button>
                  </div>

                  <div className="relative z-10">
                    <AddMedicationForm
                      onClose={() => setShowAddModal(false)}
                      onSuccess={() => {
                        setShowAddModal(false);
                        // Could add a success notification here
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Today's Schedule Modal */}
          <AnimatePresence>
            {showScheduleModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setShowScheduleModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.7, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.7, opacity: 0, y: 50 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="neu p-10 rounded-3xl max-w-2xl w-full relative overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 via-primary-500/5 to-accent-500/10 rounded-3xl"></div>

                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="neu-inset p-3 rounded-2xl">
                        <Calendar className="w-6 h-6 text-secondary-500" />
                      </div>
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-secondary-500 to-primary-500 bg-clip-text text-transparent">
                        Today&apos;s Schedule
                      </h3>
                      <span className="ml-3 text-sm font-normal text-neu-500 dark:text-neu-400 bg-neu-100 dark:bg-neu-800 px-3 py-1 rounded-full">
                        {medications.filter((m) => m.takenToday).length}/
                        {medications.length} completed
                      </span>
                    </div>
                    <motion.button
                      onClick={() => setShowScheduleModal(false)}
                      className="neu-inset p-3 rounded-2xl hover:neu-pressed transition-all duration-200 group"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-5 h-5 text-neu-600 dark:text-neu-400 group-hover:text-red-500 transition-colors duration-200" />
                    </motion.button>
                  </div>

                  <div className="relative z-10 space-y-6">
                    {medications.map((medication, index) => (
                      <motion.div
                        key={medication.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="neu-inset p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 group relative overflow-visible"
                        whileHover={{ x: 5, y: -2 }}
                      >
                        {/* Progress indicator */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary-500 to-primary-500 rounded-l-2xl"></div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1 min-w-0">
                            <motion.div
                              className={`w-8 h-8 bg-gradient-to-r ${
                                medication.color
                              } rounded-full mr-6 relative ${
                                !medication.isActive ? "animate-pulse" : ""
                              }`}
                              animate={
                                !medication.isActive
                                  ? { scale: [1, 1.2, 1] }
                                  : {}
                              }
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              {!medication.isActive && (
                                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping"></div>
                              )}
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-xl text-neu-800 dark:text-neu-200 group-hover:text-secondary-500 transition-colors duration-300 mb-1">
                                {medication.name}
                              </p>
                              <p className="text-base text-neu-600 dark:text-neu-400">
                                {medication.times[0]} • {medication.dosage}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 ml-6 flex-shrink-0">
                            <motion.div
                              animate={
                                !medication.isActive
                                  ? { scale: [1, 1.1, 1] }
                                  : {}
                              }
                              transition={{ duration: 0.5 }}
                            >
                              <Bell
                                className={`w-6 h-6 ${
                                  !medication.isActive
                                    ? "text-green-500"
                                    : "text-secondary-500"
                                }`}
                              />
                            </motion.div>
                            <div
                              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                                !medication.isActive
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}
                            >
                              {!medication.isActive ? "Completed" : "Pending"}
                            </div>
                            <motion.button
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                !medication.isActive
                                  ? "neu-pressed text-green-600 dark:text-green-400"
                                  : "neu text-neu-600 dark:text-neu-400 hover:neu-pressed hover:text-secondary-500"
                              }`}
                              onClick={() => toggleMedication(medication.id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {!medication.isActive ? (
                                <div className="flex items-center space-x-2">
                                  <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 0.5 }}
                                  >
                                    <Check className="w-4 h-4" />
                                  </motion.div>
                                  <span>Taken</span>
                                </div>
                              ) : (
                                "Mark Taken"
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppWrapper>
  );
}
