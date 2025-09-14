import { motion } from "framer-motion";
import { Clock, Pill } from "lucide-react";
import { useState } from "react";
import { Medication } from "@/types";

interface MedicationCardProps {
  medication: Medication;
  delay: number;
  onTaken: () => void;
}

export const MedicationCard = ({
  medication,
  delay,
  onTaken,
}: MedicationCardProps) => {
  const [isTaken, setIsTaken] = useState(false);

  const handleTakeClick = () => {
    setIsTaken(true);
    onTaken();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      className={`
        p-6 rounded-3xl transition-all duration-300 cursor-pointer relative overflow-hidden group
        ${
          isTaken
            ? "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 shadow-neu-inset"
            : "bg-white dark:bg-neu-800 shadow-neu-light dark:shadow-neu-dark hover:shadow-xl"
        }
        hover:shadow-lg transform hover:-translate-y-2 hover:scale-105
      `}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background gradient overlay */}
      <div
        className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
          isTaken
            ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-100"
            : "bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100"
        }`}
      ></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              className={`p-3 rounded-full ${medication.color} relative`}
              animate={isTaken ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Pill className="w-6 h-6 text-white" />
              {isTaken && (
                <div className="absolute inset-0 rounded-full bg-green-400 animate-ping"></div>
              )}
            </motion.div>
            <div>
              <h3 className="font-semibold text-neu-800 dark:text-neu-50 group-hover:text-primary-500 transition-colors duration-300">
                {medication.name}
              </h3>
              <p className="text-sm text-neu-600 dark:text-neu-300">
                {medication.dosage}
              </p>
            </div>
          </div>
          <div className="text-right">
            <motion.div
              animate={isTaken ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Clock className="w-5 h-5 text-neu-500 mb-1" />
            </motion.div>
            <p className="text-sm font-medium">{medication.times.join(", ")}</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTakeClick}
          disabled={isTaken}
          className={`
            w-full py-3 px-4 rounded-2xl font-medium transition-all relative overflow-hidden
            ${
              isTaken
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-primary-400 to-secondary-400 text-white hover:from-primary-500 hover:to-secondary-500"
            }
          `}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          {isTaken ? (
            <motion.span
              className="flex items-center justify-center relative z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.5 }}
              >
                ✅
              </motion.span>
              <span className="ml-2">Taken! You&apos;re amazing!</span>
            </motion.span>
          ) : (
            <span className="relative z-10">Mark as Taken</span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};
