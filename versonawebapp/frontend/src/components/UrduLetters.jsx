import React, { useMemo } from "react";
import { motion } from "framer-motion";

/**
 * UrduLetters (Minimal & Premium)
 * --------------------------------
 * Subtle background Urdu letters
 * - Few letters
 * - Slow movement
 * - No visual noise
 */

export default function UrduLetters() {
  // ✅ Limited, meaningful characters (no repetition spam)
  const LETTERS = ["ا", "ر", "د", "و", "ع", "ل", "م", "ص", "ف"];

  const items = useMemo(() => {
    return LETTERS.slice(0, 8).map((char) => ({
      char,
      size: 48 + Math.random() * 32,
      x: Math.random() * 100,
      y: Math.random() * 100,
      driftX: (Math.random() - 0.5) * 60, // subtle drift
      driftY: (Math.random() - 0.5) * 60,
      duration: 30 + Math.random() * 20, // slow
      opacity: 0.04 + Math.random() * 0.04,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((l, i) => (
        <motion.div
          key={i}
          className="absolute font-urdu select-none text-white"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            fontSize: `${l.size}px`,
            opacity: l.opacity,
          }}
          animate={{
            x: [0, l.driftX, 0],
            y: [0, l.driftY, 0],
          }}
          transition={{
            duration: l.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {l.char}
        </motion.div>
      ))}
    </div>
  );
}
