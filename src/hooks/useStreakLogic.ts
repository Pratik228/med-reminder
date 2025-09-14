import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useStreakLogic = (userId: string, medicationId: string) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastTaken, setLastTaken] = useState<Date | null>(null);

  useEffect(() => {
    if (!userId || !medicationId) return;

    const streakRef = doc(db, "streaks", `${userId}_${medicationId}`);

    const unsubscribe = onSnapshot(streakRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setCurrentStreak(data.currentStreak || 0);
        setLongestStreak(data.longestStreak || 0);
        setLastTaken(data.lastTaken?.toDate() || null);
      }
    });

    return unsubscribe;
  }, [userId, medicationId]);

  const updateStreak = async (taken: boolean) => {
    const streakRef = doc(db, "streaks", `${userId}_${medicationId}`);
    const now = new Date();

    try {
      const streakDoc = await getDoc(streakRef);
      const existing = streakDoc.exists()
        ? streakDoc.data()
        : {
            currentStreak: 0,
            longestStreak: 0,
            lastTaken: null,
          };

      let newCurrentStreak = existing.currentStreak;
      let newLongestStreak = existing.longestStreak;

      if (taken) {
        const lastTakenDate = existing.lastTaken?.toDate();
        const isConsecutive =
          lastTakenDate &&
          now.getTime() - lastTakenDate.getTime() <= 24 * 60 * 60 * 1000; // 24 hours

        newCurrentStreak = isConsecutive ? existing.currentStreak + 1 : 1;
        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
      } else {
        // Medication missed - reset current streak
        newCurrentStreak = 0;
      }

      await updateDoc(streakRef, {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastTaken: taken ? now : existing.lastTaken,
        updatedAt: now,
      });

      return {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
      };
    } catch (error) {
      console.error("Error updating streak:", error);
      throw error;
    }
  };

  return {
    currentStreak,
    longestStreak,
    lastTaken,
    updateStreak,
  };
};
