import { useGetStreakQuery, useUpdateStreakMutation } from "@/lib/api";

export const useStreakLogic = (userId: string, medicationId: string) => {
  const {
    data: streak,
    isLoading,
    error,
  } = useGetStreakQuery(medicationId, {
    skip: !userId || !medicationId,
  });

  const [updateStreakMutation] = useUpdateStreakMutation();

  const updateStreak = async (taken: boolean) => {
    if (!userId || !medicationId) {
      throw new Error("User or medication ID not provided");
    }

    try {
      const result = await updateStreakMutation({
        medicationId,
        taken,
      }).unwrap();

      return {
        currentStreak: result.currentStreak,
        longestStreak: result.longestStreak,
      };
    } catch (error) {
      console.error("Error updating streak:", error);
      throw error;
    }
  };

  return {
    currentStreak: streak?.currentStreak || 0,
    longestStreak: streak?.longestStreak || 0,
    lastTaken: streak?.lastTaken ? new Date(streak.lastTaken) : null,
    updateStreak,
    loading: isLoading,
    error,
  };
};
