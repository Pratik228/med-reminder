import { useAuth } from "./useAuth";
import {
  useGetMedicationsQuery,
  useAddMedicationMutation,
  useUpdateMedicationMutation,
  useDeleteMedicationMutation,
  useToggleMedicationTakenMutation,
} from "@/lib/api";
import { Medication } from "@/types";

type NewMedicationInput = Omit<Medication, "id" | "userId" | "createdAt"> & {
  startDate: string | Date;
  endDate?: string | Date;
};

type MedicationUpdates = Partial<
  Omit<Medication, "id" | "userId" | "createdAt">
> & {
  startDate?: string | Date;
  endDate?: string | Date;
};

export const useMedications = () => {
  const { user } = useAuth();

  const {
    data: medications = [],
    isLoading: loading,
    error: queryError,
  } = useGetMedicationsQuery(undefined, {
    skip: !user,
  });

  const [addMedicationMutation, { error: addError }] =
    useAddMedicationMutation();
  const [updateMedicationMutation, { error: updateError }] =
    useUpdateMedicationMutation();
  const [deleteMedicationMutation, { error: deleteError }] =
    useDeleteMedicationMutation();
  const [toggleMedicationTakenMutation, { error: toggleError }] =
    useToggleMedicationTakenMutation();

  const error =
    queryError || addError || updateError || deleteError || toggleError;

  // Add a new medication
  const addMedication = async (medicationData: NewMedicationInput) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const result = await addMedicationMutation({
        ...medicationData,
        startDate:
          typeof medicationData.startDate === "string"
            ? medicationData.startDate
            : (medicationData.startDate as Date).toISOString(),
        endDate: medicationData.endDate
          ? typeof medicationData.endDate === "string"
            ? (medicationData.endDate as string)
            : (medicationData.endDate as Date).toISOString()
          : undefined,
      }).unwrap();
      return result.id;
    } catch (err) {
      throw err;
    }
  };

  // Update a medication
  const updateMedication = async (id: string, updates: MedicationUpdates) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      const updateData: Record<string, unknown> = { ...updates };

      // Convert Date objects to ISO strings
      if (updates.startDate) {
        updateData.startDate =
          typeof updates.startDate === "string"
            ? updates.startDate
            : (updates.startDate as Date).toISOString();
      }
      if (updates.endDate) {
        updateData.endDate =
          typeof updates.endDate === "string"
            ? updates.endDate
            : (updates.endDate as Date).toISOString();
      }

      await updateMedicationMutation({ id, updates: updateData }).unwrap();
    } catch (err) {
      throw err;
    }
  };

  // Delete a medication
  const deleteMedication = async (id: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      await deleteMedicationMutation(id).unwrap();
    } catch (err) {
      throw err;
    }
  };

  // Toggle medication taken status
  const toggleMedicationTaken = async (id: string) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      await toggleMedicationTakenMutation(id).unwrap();
    } catch (err) {
      throw err;
    }
  };

  return {
    medications,
    loading,
    error: error ? (error as Error)?.message || "An error occurred" : null,
    addMedication,
    updateMedication,
    deleteMedication,
    toggleMedicationTaken,
  };
};
