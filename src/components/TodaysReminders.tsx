"use client";
import { motion } from "framer-motion";
import { Clock, Bell, Check } from "lucide-react";
import { Medication } from "@/types";

interface TodaysRemindersProps {
  medications: Medication[];
  onToggleMedication: (id: string) => void;
  completedCount?: number;
  totalCount?: number;
}

export default function TodaysReminders({
  medications,
  onToggleMedication,
  completedCount,
  totalCount,
}: TodaysRemindersProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="neu p-8 rounded-3xl relative overflow-visible"
    >
      {/* Subtle background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-neu-900 dark:text-neu-50 mb-8 flex items-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Clock className="w-6 h-6 mr-3 text-primary-500" />
          </motion.div>
          Today&apos;s Reminders
          <span className="ml-3 text-sm font-normal text-neu-500 dark:text-neu-400">
            ({completedCount ?? medications.filter((m) => !m.isActive).length}/
            {totalCount ?? medications.length} completed)
          </span>
        </h2>

        <div className="space-y-8">
          {medications.map((medication, index) => (
            <motion.div
              key={medication.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="neu-inset p-8 flex items-center justify-between rounded-2xl hover:scale-[1.02] transition-all duration-300 group relative overflow-visible z-20"
              whileHover={{ x: 5, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Progress indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-l-2xl"></div>

              <div className="flex items-center flex-1 min-w-0">
                <motion.div
                  className={`w-8 h-8 bg-gradient-to-r ${
                    medication.color
                  } rounded-full mr-6 relative ${
                    !medication.isActive ? "animate-pulse" : ""
                  }`}
                  animate={!medication.isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {!medication.isActive && (
                    <div className="absolute inset-0 rounded-full bg-green-400 animate-ping"></div>
                  )}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xl text-neu-800 dark:text-neu-200 group-hover:text-primary-500 transition-colors duration-300 mb-1">
                    {medication.name}
                  </p>
                  <p className="text-base text-neu-600 dark:text-neu-400">
                    {medication.times[0]} • {medication.dosage}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 ml-6 flex-shrink-0">
                <motion.div
                  animate={!medication.isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className="relative z-30"
                >
                  <Bell
                    className={`w-7 h-7 ${
                      !medication.isActive
                        ? "text-green-500"
                        : "text-primary-500"
                    }`}
                  />
                </motion.div>
                <motion.button
                  className={`px-6 py-3 rounded-xl text-base font-medium transition-all duration-200 relative overflow-visible z-30 ${
                    !medication.isActive
                      ? "neu-pressed text-green-600 dark:text-green-400"
                      : "neu text-neu-600 dark:text-neu-400 hover:neu-pressed hover:text-primary-500"
                  }`}
                  onClick={() => onToggleMedication(medication.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {!medication.isActive ? (
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                      <span>Taken</span>
                    </div>
                  ) : (
                    "Mark Taken"
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
