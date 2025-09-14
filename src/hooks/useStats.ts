import { useState, useEffect } from "react";
import { useMedications } from "./useMedications";
import { useAuth } from "./useAuth";

export const useStats = () => {
  const { medications } = useMedications();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    streak: 0,
    compliance: 0,
    weeklyCount: 0,
    todayCompleted: 0,
    todayTotal: 0,
  });

  useEffect(() => {
    if (!user || medications.length === 0) {
      setStats({
        streak: 0,
        compliance: 0,
        weeklyCount: 0,
        todayCompleted: 0,
        todayTotal: 0,
      });
      return;
    }

    // Calculate today's stats
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const todayMeds = medications.filter((med) => {
      const startDate = med.startDate.toISOString().split("T")[0];
      const endDate = med.endDate
        ? med.endDate.toISOString().split("T")[0]
        : null;

      return startDate <= todayStr && (!endDate || endDate >= todayStr);
    });

    const todayCompleted = todayMeds.filter((med) => !med.isActive).length;
    const todayTotal = todayMeds.length;
    const compliance =
      todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

    // Calculate weekly count (medications taken this week)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Calculate weekly count (medications taken this week)
    // For now, we'll use a simple calculation based on today's activity
    // In a real app, you'd track daily medication logs in Firebase
    const weeklyCount = todayCompleted;

    // Calculate streak (consecutive days with 100% compliance)
    // For now, we'll use a simple calculation based on today's compliance
    let streak = 0;
    if (compliance === 100 && todayTotal > 0) {
      // If today is 100% compliant, add to streak
      // In a real app, you'd check previous days from Firebase
      streak = 1;
    }

    setStats({
      streak,
      compliance,
      weeklyCount,
      todayCompleted,
      todayTotal,
    });
  }, [medications, user]);

  return stats;
};
