import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { MedicationLog } from "@/types";

interface CalendarProps {
  userId: string;
  medicationLogs: MedicationLog[];
}

export const MedicationCalendar = ({
  userId,
  medicationLogs,
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDateStatus = (date: Date) => {
    const dayLogs = medicationLogs.filter((log) =>
      isSameDay(new Date(log.scheduledTime), date)
    );

    if (dayLogs.length === 0) return "none";

    const takenCount = dayLogs.filter((log) => log.status === "taken").length;
    const totalCount = dayLogs.length;

    if (takenCount === totalCount) return "complete";
    if (takenCount > 0) return "partial";
    return "missed";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "bg-green-500";
      case "partial":
        return "bg-yellow-500";
      case "missed":
        return "bg-red-500";
      default:
        return "bg-neu-200 dark:bg-neu-700";
    }
  };

  return (
    <div className="bg-white dark:bg-neu-800 rounded-3xl p-6 shadow-neu-light dark:shadow-neu-dark">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-2 rounded-full bg-neu-100 dark:bg-neu-700 hover:bg-neu-200 dark:hover:bg-neu-600"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <h3 className="text-xl font-bold text-neu-800 dark:text-neu-50">
          {format(currentDate, "MMMM yyyy")}
        </h3>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-2 rounded-full bg-neu-100 dark:bg-neu-700 hover:bg-neu-200 dark:hover:bg-neu-600"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-neu-600 dark:text-neu-400 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day) => {
          const status = getDateStatus(day);
          const isToday = isSameDay(day, new Date());

          return (
            <motion.div
              key={day.toISOString()}
              whileHover={{ scale: 1.05 }}
              className={`
                aspect-square flex items-center justify-center rounded-xl text-sm font-medium relative
                ${isToday ? "ring-2 ring-primary-500" : ""}
                ${!isSameMonth(day, currentDate) ? "opacity-50" : ""}
                ${getStatusColor(status)}
                ${
                  status === "none"
                    ? "text-neu-600 dark:text-neu-400"
                    : "text-white"
                }
              `}
            >
              {format(day, "d")}
              {status !== "none" && (
                <div className="absolute mt-6 w-1 h-1 rounded-full bg-white" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-neu-600 dark:text-neu-400">Complete</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-neu-600 dark:text-neu-400">Partial</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-neu-600 dark:text-neu-400">Missed</span>
        </div>
      </div>
    </div>
  );
};
