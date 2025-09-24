import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Medication, MedicationLog, Streak, Stats, User } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      // Add auth token if available
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken");
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Medication", "MedicationLog", "Streak", "Stats"],
  endpoints: (builder) => ({
    // Medications
    getMedications: builder.query<Medication[], void>({
      query: () => "medications",
      providesTags: ["Medication"],
    }),
    addMedication: builder.mutation<
      Medication,
      Omit<Medication, "id" | "userId" | "createdAt">
    >({
      query: (medication) => ({
        url: "medications",
        method: "POST",
        body: medication,
      }),
      invalidatesTags: ["Medication"],
    }),
    updateMedication: builder.mutation<
      Medication,
      { id: string; updates: Partial<Medication> }
    >({
      query: ({ id, updates }) => ({
        url: `medications/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: ["Medication"],
    }),
    deleteMedication: builder.mutation<void, string>({
      query: (id) => ({
        url: `medications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Medication"],
    }),
    toggleMedicationTaken: builder.mutation<void, string>({
      query: (id) => ({
        url: `medications/${id}/toggle-taken`,
        method: "POST",
      }),
      invalidatesTags: ["Medication", "MedicationLog", "Streak", "Stats"],
    }),

    // Medication Logs
    getMedicationLogs: builder.query<
      MedicationLog[],
      { medicationId?: string; startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: "medication-logs",
        params,
      }),
      providesTags: ["MedicationLog"],
    }),

    // Streaks
    getStreak: builder.query<Streak, string>({
      query: (medicationId) => `streaks/${medicationId}`,
      providesTags: ["Streak"],
    }),
    updateStreak: builder.mutation<
      Streak,
      { medicationId: string; taken: boolean }
    >({
      query: ({ medicationId, taken }) => ({
        url: `streaks/${medicationId}`,
        method: "PATCH",
        body: { taken },
      }),
      invalidatesTags: ["Streak", "Stats"],
    }),

    // Stats
    getStats: builder.query<Stats, void>({
      query: () => "stats",
      providesTags: ["Stats"],
    }),

    // Email
    sendReminder: builder.mutation<
      void,
      {
        medicationId: string;
        medicationName: string;
        dosage: string;
        time: string;
      }
    >({
      query: (data) => ({
        url: "emails/reminder",
        method: "POST",
        body: data,
      }),
    }),
    sendFollowUpReminder: builder.mutation<
      void,
      {
        medicationId: string;
        medicationName: string;
        dosage: string;
        time: string;
        reminderCount: number;
      }
    >({
      query: (data) => ({
        url: "emails/follow-up",
        method: "POST",
        body: data,
      }),
    }),

    // Auth
    verifyToken: builder.query<User, void>({
      query: () => "auth/verify",
    }),
  }),
});

export const {
  useGetMedicationsQuery,
  useAddMedicationMutation,
  useUpdateMedicationMutation,
  useDeleteMedicationMutation,
  useToggleMedicationTakenMutation,
  useGetMedicationLogsQuery,
  useGetStreakQuery,
  useUpdateStreakMutation,
  useGetStatsQuery,
  useSendReminderMutation,
  useSendFollowUpReminderMutation,
  useVerifyTokenQuery,
} = api;
