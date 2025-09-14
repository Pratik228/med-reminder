"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MedicationCard } from "./MedicationCard";
import { StreakCounter } from "./StreakCounter";
import { BirdAnimation } from "./animations/BirdAnimation";
import { Medication } from "@/types";

export const Dashboard = () => {
  const { user } = useAuth();
  const [todaysMeds, setTodaysMeds] = useState<Medication[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleMedicationTaken = (medicationId: string) => {
    // Update medication status
    setTodaysMeds((prev) =>
      prev.map((med) =>
        med.id === medicationId ? { ...med, isActive: false } : med
      )
    );

    // Update streak
    setCurrentStreak((prev) => prev + 1);

    // Show celebration
    setShowCelebration(true);
  };

  // Mock data for demonstration
  useEffect(() => {
    const mockMedications: Medication[] = [
      {
        id: "1",
        userId: user?.uid || "",
        name: "Vitamin D",
        dosage: "1000 IU",
        frequency: "daily",
        times: ["08:00"],
        startDate: new Date(),
        color: "bg-primary-500",
        icon: "💊",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "2",
        userId: user?.uid || "",
        name: "Omega-3",
        dosage: "1000mg",
        frequency: "daily",
        times: ["14:00"],
        startDate: new Date(),
        color: "bg-secondary-500",
        icon: "🐟",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "3",
        userId: user?.uid || "",
        name: "Multivitamin",
        dosage: "1 tablet",
        frequency: "daily",
        times: ["09:00"],
        startDate: new Date(),
        color: "bg-green-500",
        icon: "🌿",
        isActive: true,
        createdAt: new Date(),
      },
    ];

    setTodaysMeds(mockMedications);
    setCurrentStreak(12);
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neu-900 dark:to-neu-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-neu-800 dark:text-neu-50 mb-2">
            Good morning, beautiful! 💕
          </h1>
          <p className="text-neu-600 dark:text-neu-300">
            Let&apos;s keep that healthy streak going!
          </p>
        </motion.div>

        {/* Streak Counter */}
        <StreakCounter streak={currentStreak} />

        {/* Today's Medications */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {todaysMeds.map((med, index) => (
              <MedicationCard
                key={med.id}
                medication={med}
                delay={index * 0.1}
                onTaken={() => handleMedicationTaken(med.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Bird Animation */}
        <AnimatePresence>
          {showCelebration && (
            <BirdAnimation
              type="celebration"
              onComplete={() => setShowCelebration(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
