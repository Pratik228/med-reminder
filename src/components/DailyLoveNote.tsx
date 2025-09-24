import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Heart, Edit3, Save, X } from "lucide-react";
// Firestore removed. We'll keep love note in localStorage keyed by userId+date.

interface DailyLoveNoteProps {
  userId: string;
}

export const DailyLoveNote = ({ userId }: DailyLoveNoteProps) => {
  const [note, setNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState("");
  const [showHearts, setShowHearts] = useState(false);

  const loveNotes = [
    "You're absolutely amazing, and I'm so proud of you! 💕",
    "Taking care of yourself is the most beautiful thing you can do! ✨",
    "You're stronger than you know, gorgeous! 💪",
    "Every pill you take is an act of self-love! 💖",
    "I believe in you completely! You've got this! 🌟",
    "Your health journey inspires me every day! 💫",
    "You're worth every bit of care you give yourself! 💝",
    "Consistency is your superpower! 🦸‍♀️",
  ];

  useEffect(() => {
    if (!userId) return;
    const today = new Date().toDateString();
    const key = `dailyNote:${userId}:${today}`;
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (stored) {
      setNote(stored);
    } else {
      const random = getRandomLoveNote();
      setNote(random);
      try {
        localStorage.setItem(key, random);
      } catch (_) {}
    }
  }, [userId]);

  const getRandomLoveNote = () => {
    return loveNotes[Math.floor(Math.random() * loveNotes.length)];
  };

  const saveNote = async () => {
    if (!userId) return;
    const today = new Date().toDateString();
    const key = `dailyNote:${userId}:${today}`;
    try {
      localStorage.setItem(key, editingNote);
      setNote(editingNote);
      setIsEditing(false);
      setShowHearts(true);
      setTimeout(() => setShowHearts(false), 2000);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-3xl p-6 shadow-neu-light dark:shadow-neu-dark relative overflow-hidden"
    >
      {/* Background Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200 dark:text-pink-800 text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-primary-500" />
            <h3 className="text-lg font-bold text-neu-800 dark:text-neu-50">
              Daily Love Note
            </h3>
          </div>

          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsEditing(true);
                setEditingNote(note);
              }}
              className="p-2 rounded-full bg-white/50 dark:bg-neu-700/50 hover:bg-white/70 dark:hover:bg-neu-600/70"
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
          ) : (
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={saveNote}
                className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
              >
                <Save className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <motion.p
            key={note}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-neu-700 dark:text-neu-200 leading-relaxed"
          >
            {note}
          </motion.p>
        ) : (
          <textarea
            value={editingNote}
            onChange={(e) => setEditingNote(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/70 dark:bg-neu-700/70 border-none outline-none resize-none text-neu-800 dark:text-neu-200"
            rows={3}
            placeholder="Write yourself a loving note..."
          />
        )}
      </div>

      {/* Floating Hearts Animation */}
      <AnimatePresence>
        {showHearts && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: "50%", y: "50%" }}
                animate={{
                  scale: [0, 1, 0],
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 - Math.random() * 100}%`,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                className="absolute text-2xl"
                style={{ left: 0, top: 0 }}
              >
                💖
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
