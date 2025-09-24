"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MedicationCard } from "./MedicationCard";
import { StreakCounter } from "./StreakCounter";
import { BirdAnimation } from "./animations/BirdAnimation";
import { useGetMedicationsQuery, useGetStatsQuery } from "@/lib/api";

export const Dashboard = () => {
  const { user } = useAuth();
  const [showCelebration, setShowCelebration] = useState(false);

  // Fetch data from backend
  const { data: medications = [] } = useGetMedicationsQuery();
  const { data: stats } = useGetStatsQuery();

  const handleMedicationTaken = (medicationId: string) => {
    // Show celebration
    setShowCelebration(true);
  };

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
        <StreakCounter streak={stats?.streak || 0} />

        {/* Today's Medications */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {medications.map((med, index) => (
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
