import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
  FieldValue,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Medication } from "@/types";
import { useAuth } from "./useAuth";

export const useMedications = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add a new medication
  const addMedication = async (
    medicationData: Omit<Medication, "id" | "userId" | "createdAt">
  ) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "medications"), {
        ...medicationData,
        userId: user.uid,
        createdAt: Timestamp.now(),
        startDate: Timestamp.fromDate(medicationData.startDate),
        endDate: medicationData.endDate
          ? Timestamp.fromDate(medicationData.endDate)
          : null,
      });

      return docRef.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add medication");
      throw err;
    }
  };

  // Update a medication
  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    try {
      const medicationRef = doc(db, "medications", id);
      const updateData: Record<
        string,
        FieldValue | Partial<unknown> | undefined
      > = { ...updates };

      // Convert Date objects to Timestamps
      if (updates.startDate) {
        updateData.startDate = Timestamp.fromDate(updates.startDate);
      }
      if (updates.endDate) {
        updateData.endDate = Timestamp.fromDate(updates.endDate);
      }

      await updateDoc(medicationRef, updateData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update medication"
      );
      throw err;
    }
  };

  // Delete a medication
  const deleteMedication = async (id: string) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    try {
      await deleteDoc(doc(db, "medications", id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete medication"
      );
      throw err;
    }
  };

  // Toggle medication taken status
  const toggleMedicationTaken = async (id: string, taken: boolean) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    try {
      await updateMedication(id, { isActive: !taken });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update medication status"
      );
      throw err;
    }
  };

  // Reset medication status at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      // Reset all medications to active (not taken) at midnight
      medications.forEach(async (medication) => {
        if (!medication.isActive) {
          try {
            await updateMedication(medication.id, { isActive: true });
          } catch (error) {
            console.error("Error resetting medication status:", error);
          }
        }
      });
    }, timeUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, [medications, user]);

  // Listen to medications changes
  useEffect(() => {
    if (!user) {
      setMedications([]);
      setLoading(false);
      return;
    }

    // Get all medications and filter on client side to avoid index requirements
    const unsubscribe = onSnapshot(
      collection(db, "medications"),
      (snapshot) => {
        const medicationsData: Medication[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();

          // Only include medications for the current user
          if (data.userId === user.uid) {
            medicationsData.push({
              id: doc.id,
              userId: data.userId,
              name: data.name,
              dosage: data.dosage,
              frequency: data.frequency,
              times: data.times,
              startDate: data.startDate?.toDate() || new Date(),
              endDate: data.endDate?.toDate(),
              notes: data.notes,
              color: data.color,
              icon: data.icon,
              isActive: data.isActive,
              createdAt: data.createdAt?.toDate() || new Date(),
            });
          }
        });

        // Sort by createdAt in descending order (newest first)
        medicationsData.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        setMedications(medicationsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return {
    medications,
    loading,
    error,
    addMedication,
    updateMedication,
    deleteMedication,
    toggleMedicationTaken,
  };
};
