import { useGetStatsQuery } from "@/lib/api";
import { useAuth } from "./useAuth";

export const useStats = () => {
  const { user } = useAuth();

  const {
    data: stats = {
      streak: 0,
      compliance: 0,
      weeklyCount: 0,
      todayCompleted: 0,
      todayTotal: 0,
    },
    isLoading,
    error,
  } = useGetStatsQuery(undefined, {
    skip: !user,
  });

  return {
    ...stats,
    loading: isLoading,
    error,
  };
};
