export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
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
  startDate: Date;
  endDate?: Date;
  notes?: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
}

export interface MedicationLog {
  id: string;
  userId: string;
  medicationId: string;
  scheduledTime: Date;
  takenAt?: Date;
  status: "taken" | "missed" | "pending";
  notes?: string;
  createdAt: Date;
}

export interface Streak {
  id: string;
  userId: string;
  medicationId: string;
  currentStreak: number;
  longestStreak: number;
  lastTaken: Date;
  updatedAt: Date;
}
