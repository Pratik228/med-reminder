"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useMedications } from "@/hooks/useMedications";

interface AddMedicationFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddMedicationForm = ({
  onClose,
  onSuccess,
}: AddMedicationFormProps) => {
  const { addMedication, error } = useMedications();
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    time: "",
    frequency: "daily" as "daily" | "weekly" | "custom",
    notes: "",
    color: "from-primary-500 to-pink-500",
    icon: "💊",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const medicationData = {
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        times: [formData.time],
        startDate: new Date().toISOString(),
        notes: formData.notes,
        color: formData.color,
        icon: formData.icon,
        isActive: true,
      };

      await addMedication(medicationData);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error adding medication:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to add medication"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const colorOptions = [
    {
      value: "#f24ff0",
      label: "Pink",
      preview: "bg-gradient-to-r from-primary-500 to-pink-500",
    },
    {
      value: "#8b5cf6",
      label: "Purple",
      preview: "bg-gradient-to-r from-secondary-500 to-purple-500",
    },
    {
      value: "#10b981",
      label: "Green",
      preview: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
    {
      value: "#3b82f6",
      label: "Blue",
      preview: "bg-gradient-to-r from-blue-500 to-cyan-500",
    },
    {
      value: "#f97316",
      label: "Orange",
      preview: "bg-gradient-to-r from-orange-500 to-red-500",
    },
    {
      value: "#eab308",
      label: "Yellow",
      preview: "bg-gradient-to-r from-yellow-500 to-amber-500",
    },
  ];

  const iconOptions = ["💊", "💉", "🌿", "🐟", "🥛", "💧", "🔬", "⚕️"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {(error || submitError) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300"
        >
          <p className="font-medium">Error:</p>
          <p className="text-sm">{error || submitError}</p>
        </motion.div>
      )}
      {/* Medication Name */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="text-sm font-semibold text-neu-700 dark:text-neu-300 mb-3 flex items-center">
          <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
          Medication Name *
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full neu-inset p-4 rounded-2xl text-neu-900 dark:text-neu-50 placeholder-neu-500 dark:placeholder-neu-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:neu-pressed transition-all duration-300 text-lg"
            placeholder="e.g., Vitamin D"
          />
        </div>
      </motion.div>

      {/* Dosage */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="text-sm font-semibold text-neu-700 dark:text-neu-300 mb-3 flex items-center">
          <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
          Dosage *
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={formData.dosage}
            onChange={(e) => handleInputChange("dosage", e.target.value)}
            className="w-full neu-inset p-4 rounded-2xl text-neu-900 dark:text-neu-50 placeholder-neu-500 dark:placeholder-neu-400 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 focus:neu-pressed transition-all duration-300 text-lg"
            placeholder="e.g., 1000 IU"
          />
        </div>
      </motion.div>

      {/* Time */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="text-sm font-semibold text-neu-700 dark:text-neu-300 mb-3 flex items-center">
          <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
          Time *
        </label>
        <div className="relative">
          <input
            type="time"
            required
            value={formData.time}
            onChange={(e) => handleInputChange("time", e.target.value)}
            className="w-full neu-inset p-4 rounded-2xl text-neu-900 dark:text-neu-50 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:neu-pressed transition-all duration-300 text-lg"
          />
        </div>
      </motion.div>

      {/* Frequency */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="text-sm font-semibold text-neu-700 dark:text-neu-300 mb-3 flex items-center">
          <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
          Frequency
        </label>
        <select
          value={formData.frequency}
          onChange={(e) => handleInputChange("frequency", e.target.value)}
          className="w-full neu-inset p-4 rounded-2xl text-neu-900 dark:text-neu-50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:neu-pressed transition-all duration-300 text-lg"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="custom">Custom</option>
        </select>
      </motion.div>

      {/* Color Selection */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label className="text-sm font-semibold text-neu-700 dark:text-neu-300 mb-3 flex items-center">
          <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
          Color Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {colorOptions.map((color) => (
            <motion.button
              key={color.value}
              type="button"
              onClick={() => handleInputChange("color", color.value)}
              className={`p-3 rounded-xl neu-inset hover:neu-pressed transition-all duration-200 ${
                formData.color === color.value ? "ring-2 ring-primary-500" : ""
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`w-8 h-8 rounded-full mx-auto mb-2 ${color.preview}`}
              ></div>
              <span className="text-xs text-neu-600 dark:text-neu-400">
                {color.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Icon Selection */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <label className="text-sm font-semibold text-neu-700 dark:text-neu-300 mb-3 flex items-center">
          <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
          Icon
        </label>
        <div className="grid grid-cols-4 gap-3">
          {iconOptions.map((icon) => (
            <motion.button
              key={icon}
              type="button"
              onClick={() => handleInputChange("icon", icon)}
              className={`p-3 rounded-xl neu-inset hover:neu-pressed transition-all duration-200 text-2xl ${
                formData.icon === icon ? "ring-2 ring-accent-500" : ""
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {icon}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <label className="text-sm font-semibold text-neu-700 dark:text-neu-300 mb-3 flex items-center">
          <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          className="w-full neu-inset p-4 rounded-2xl text-neu-900 dark:text-neu-50 placeholder-neu-500 dark:placeholder-neu-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:neu-pressed transition-all duration-300 text-lg resize-none"
          placeholder="Any additional notes..."
          rows={3}
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex space-x-4 pt-6"
      >
        <motion.button
          type="button"
          className="flex-1 neu-inset p-4 rounded-2xl text-neu-600 dark:text-neu-400 font-semibold hover:neu-pressed transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          disabled={
            isSubmitting || !formData.name || !formData.dosage || !formData.time
          }
          className="flex-1 neu p-4 rounded-2xl text-white font-bold hover:neu-pressed transition-all duration-200 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center justify-center">
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Adding...
              </>
            ) : (
              <>
                <span className="mr-2">+</span>
                Add Medication
              </>
            )}
          </span>
        </motion.button>
      </motion.div>
    </form>
  );
};
