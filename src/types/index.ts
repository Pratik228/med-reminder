export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string; // ISO string
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
    timezone: string;
  };
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: "daily" | "weekly" | "custom";
  times: string[]; // ['09:00', '21:00']
  startDate: string; // ISO string
  endDate?: string; // ISO string
  notes?: string;
  color: string;
  icon: string;
  // Whether this medication is currently enabled for the user
  isActive: boolean;
  // Daily status fields (Option 1 implementation)
  takenToday?: boolean; // true if user has marked as taken for the current date
  takenOnDate?: string; // YYYY-MM-DD in user's timezone when last takenToday was set
  lastTakenAt?: string; // ISO string of last mark-as-taken
  createdAt: string; // ISO string
}

export interface MedicationLog {
  id: string;
  userId: string;
  medicationId: string;
  scheduledTime: string; // ISO string
  takenAt?: string; // ISO string
  status: "taken" | "missed" | "pending";
  notes?: string;
  createdAt: string; // ISO string
}

export interface Streak {
  id: string;
  userId: string;
  medicationId: string;
  currentStreak: number;
  longestStreak: number;
  lastTaken: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Stats {
  streak: number;
  compliance: number;
  weeklyCount: number;
  todayCompleted: number;
  todayTotal: number;
}
