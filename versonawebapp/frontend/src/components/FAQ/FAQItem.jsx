import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/**
 * FAQItem
 * ------------------------
 * Single question + answer
 * Minimal interaction, no noise
 */
export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 py-6">
      {/* Question */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-white text-base sm:text-lg font-medium">
          {question}
        </span>

        {/* Plus / Minus */}
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/50 text-xl"
        >
          +
        </motion.span>
      </button>

      {/* Answer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-white/60 leading-relaxed text-sm sm:text-base max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
