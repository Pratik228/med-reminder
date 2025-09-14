import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface BirdAnimationProps {
  type: "celebration" | "missed";
  onComplete: () => void;
}

export const BirdAnimation = ({ type, onComplete }: BirdAnimationProps) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
      setTimeout(onComplete, 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const celebrationMessages = [
    "You're amazing! 💕",
    "So proud of you! ✨",
    "Keep it up, beautiful! 🌟",
    "You're crushing it! 💪",
  ];

  const missedMessages = [
    "Don't worry, tomorrow's a new day! 🌅",
    "We believe in you! 💕",
    "One miss doesn't break your spirit! ✨",
  ];

  const messages =
    type === "celebration" ? celebrationMessages : missedMessages;
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      >
        {/* Bird SVG Animation */}
        <motion.div
          initial={{ x: -200, y: 50 }}
          animate={{
            x: [0, 100, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
          className="relative"
        >
          <BirdSVG type={type} />

          {/* Hearts/Kisses floating */}
          {type === "celebration" && (
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.random() * 100 - 50,
                    y: -50 - Math.random() * 30,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    ease: "easeOut",
                  }}
                  className="absolute text-2xl"
                >
                  {["💕", "💖", "✨", "🌟", "💫"][i]}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Message */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-1/3 bg-white dark:bg-neu-800 px-6 py-3 rounded-full shadow-lg"
            >
              <p className="text-lg font-medium text-neu-800 dark:text-neu-50">
                {randomMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

const BirdSVG = ({ type }: { type: "celebration" | "missed" }) => {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      className="drop-shadow-lg"
    >
      {/* Happy Bird */}
      {type === "celebration" && (
        <g>
          {/* Body */}
          <ellipse cx="60" cy="70" rx="25" ry="35" fill="#FFD93D" />
          {/* Head */}
          <circle cx="60" cy="40" r="20" fill="#FFD93D" />
          {/* Wing */}
          <ellipse cx="45" cy="65" rx="12" ry="20" fill="#FFA726" />
          {/* Beak */}
          <polygon points="50,35 45,40 50,45" fill="#FF7043" />
          {/* Eyes */}
          <circle cx="55" cy="35" r="3" fill="#333" />
          <circle cx="65" cy="35" r="3" fill="#333" />
          {/* Blush */}
          <circle cx="45" cy="42" r="4" fill="#FFB3BA" opacity="0.6" />
          <circle cx="75" cy="42" r="4" fill="#FFB3BA" opacity="0.6" />
        </g>
      )}

      {/* Angry/Sad Bird */}
      {type === "missed" && (
        <g>
          {/* Body */}
          <ellipse cx="60" cy="70" rx="25" ry="35" fill="#FF6B6B" />
          {/* Head */}
          <circle cx="60" cy="40" r="20" fill="#FF6B6B" />
          {/* Wing */}
          <ellipse cx="75" cy="65" rx="12" ry="20" fill="#E55757" />
          {/* Beak */}
          <polygon points="70,40 75,45 70,50" fill="#D32F2F" />
          {/* Angry eyebrows */}
          <path d="M50 30 L60 25 L55 32" fill="#333" />
          <path d="M70 30 L60 25 L65 32" fill="#333" />
          {/* Eyes */}
          <circle cx="55" cy="35" r="2" fill="#333" />
          <circle cx="65" cy="35" r="2" fill="#333" />
        </g>
      )}
    </svg>
  );
};
