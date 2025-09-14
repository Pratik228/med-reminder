import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { useMedications } from "./useMedications";

interface MedicationReminderData {
  medicationId: string;
  medicationName: string;
  dosage: string;
  time: string;
  userEmail: string;
  userName: string;
}

export const useMedicationReminders = () => {
  const { user } = useAuth();
  const { medications } = useMedications();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sentRemindersRef = useRef<Set<string>>(new Set());

  const checkAndSendReminders = useCallback(async () => {
    if (!user || !medications.length) return;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const today = now.toISOString().split("T")[0]; // YYYY-MM-DD format

    // Find medications that need reminders now
    const medicationsToRemind = medications.filter((med) => {
      if (!med.isActive || !med.times.includes(currentTime)) {
        return false;
      }

      // Create unique key for this reminder
      const reminderKey = `${med.id}_${today}_${currentTime}`;

      // Check if we already sent a reminder for this medication today at this time
      if (sentRemindersRef.current.has(reminderKey)) {
        return false;
      }

      return true;
    });

    // Send reminders for each medication
    for (const medication of medicationsToRemind) {
      const reminderKey = `${medication.id}_${today}_${currentTime}`;

      try {
        const reminderData: MedicationReminderData = {
          medicationId: medication.id,
          medicationName: medication.name,
          dosage: medication.dosage,
          time: currentTime,
          userEmail: user.email || "",
          userName: user.displayName || user.email?.split("@")[0] || "there",
        };

        // Call the API route to send email
        await fetch("/api/send-reminder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reminderData),
        });

        // Mark this reminder as sent
        sentRemindersRef.current.add(reminderKey);

        console.log(`Reminder sent for ${medication.name} at ${currentTime}`);
      } catch (error) {
        console.error(`Failed to send reminder for ${medication.name}:`, error);
      }
    }
  }, [user, medications]);

  // Start the reminder checking interval
  useEffect(() => {
    if (!user || !medications.length) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Check every minute for medications that need reminders
    intervalRef.current = setInterval(checkAndSendReminders, 60000);

    // Also check immediately when the hook mounts
    checkAndSendReminders();

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user, medications, checkAndSendReminders]);

  // Clear sent reminders when date changes (at midnight)
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      sentRemindersRef.current.clear();
      console.log("Cleared sent reminders for new day");
    }, timeUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  // Manual reminder sending function (for testing or immediate sending)
  const sendManualReminder = useCallback(
    async (medicationId: string) => {
      if (!user) return;

      const medication = medications.find((med) => med.id === medicationId);
      if (!medication) return;

      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      const reminderData: MedicationReminderData = {
        medicationId: medication.id,
        medicationName: medication.name,
        dosage: medication.dosage,
        time: currentTime,
        userEmail: user.email || "",
        userName: user.displayName || user.email?.split("@")[0] || "there",
      };

      try {
        // Call the API route to send email
        await fetch("/api/send-reminder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reminderData),
        });
        console.log(`Manual reminder sent for ${medication.name}`);
      } catch (error) {
        console.error(
          `Failed to send manual reminder for ${medication.name}:`,
          error
        );
        throw error;
      }
    },
    [user, medications]
  );

  return {
    sendManualReminder,
  };
};
