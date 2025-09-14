import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Trophy, Star, Target, Zap } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: "streak" | "total" | "consistency";
  unlocked: boolean;
  unlockedAt?: Date;
}

interface AchievementSystemProps {
  userId: string;
  currentStreak: number;
  totalMedicationsTaken: number;
}

export const AchievementSystem = ({
  userId,
  currentStreak,
  totalMedicationsTaken,
}: AchievementSystemProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  const achievementTemplates: Achievement[] = [
    {
      id: "first_step",
      title: "First Step! 👶",
      description: "Take your first medication",
      icon: "🎯",
      requirement: 1,
      type: "total",
      unlocked: false,
    },
    {
      id: "week_warrior",
      title: "Week Warrior! 🗓️",
      description: "Maintain a 7-day streak",
      icon: "⚡",
      requirement: 7,
      type: "streak",
      unlocked: false,
    },
    {
      id: "month_master",
      title: "Month Master! 🏆",
      description: "Maintain a 30-day streak",
      icon: "👑",
      requirement: 30,
      type: "streak",
      unlocked: false,
    },
    {
      id: "century_club",
      title: "Century Club! 💯",
      description: "Take 100 medications total",
      icon: "🎉",
      requirement: 100,
      type: "total",
      unlocked: false,
    },
    {
      id: "dedication_queen",
      title: "Dedication Queen! 👸",
      description: "Maintain a 100-day streak",
      icon: "💎",
      requirement: 100,
      type: "streak",
      unlocked: false,
    },
  ];

  useEffect(() => {
    checkAchievements();
  }, [currentStreak, totalMedicationsTaken]);

  const checkAchievements = () => {
    const updated = achievementTemplates.map((achievement) => {
      let shouldUnlock = false;

      switch (achievement.type) {
        case "streak":
          shouldUnlock = currentStreak >= achievement.requirement;
          break;
        case "total":
          shouldUnlock = totalMedicationsTaken >= achievement.requirement;
          break;
      }

      if (shouldUnlock && !achievement.unlocked) {
        const unlockedAchievement = {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date(),
        };

        setNewlyUnlocked((prev) => [...prev, unlockedAchievement]);
        setTimeout(() => {
          setNewlyUnlocked((prev) =>
            prev.filter((a) => a.id !== achievement.id)
          );
        }, 5000);

        return unlockedAchievement;
      }

      return achievement;
    });

    setAchievements(updated);
  };

  return (
    <>
      <div className="bg-white dark:bg-neu-800 rounded-3xl p-6 shadow-neu-light dark:shadow-neu-dark">
        <div className="flex items-center space-x-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-bold text-neu-800 dark:text-neu-50">
            Achievements
          </h3>
        </div>

        <div className="grid gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-4 rounded-2xl border-2 transition-all duration-300
                ${
                  achievement.unlocked
                    ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20"
                    : "border-neu-200 dark:border-neu-700 bg-neu-50 dark:bg-neu-800"
                }
              `}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`
                  text-3xl p-3 rounded-full
                  ${
                    achievement.unlocked
                      ? "bg-yellow-100 dark:bg-yellow-900/30"
                      : "bg-neu-200 dark:bg-neu-700 grayscale"
                  }
                `}
                >
                  {achievement.icon}
                </div>

                <div className="flex-1">
                  <h4
                    className={`
                    font-semibold
                    ${
                      achievement.unlocked
                        ? "text-yellow-800 dark:text-yellow-200"
                        : "text-neu-600 dark:text-neu-400"
                    }
                  `}
                  >
                    {achievement.title}
                  </h4>
                  <p
                    className={`
                    text-sm
                    ${
                      achievement.unlocked
                        ? "text-yellow-700 dark:text-yellow-300"
                        : "text-neu-500 dark:text-neu-500"
                    }
                  `}
                  >
                    {achievement.description}
                  </p>
                </div>

                {achievement.unlocked && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Unlock Notification */}
      <AnimatePresence>
        {newlyUnlocked.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -50 }}
            className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-2xl max-w-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{achievement.icon}</div>
              <div>
                <h4 className="font-bold text-lg">Achievement Unlocked! 🎉</h4>
                <p className="text-yellow-100">{achievement.title}</p>
              </div>
            </div>

            {/* Confetti Animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  initial={{
                    x: "50%",
                    y: "50%",
                    scale: 0,
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
};
