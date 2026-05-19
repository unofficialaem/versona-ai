import { motion } from "framer-motion";

/**
 * FAQIntroText
 * ------------------------
 * Clean text reveal using mask animation
 * (NOT typing — this feels premium and confident)
 */
export default function FAQIntroText({ text }) {
  return (
    <div className="overflow-hidden">
      <motion.p
        initial={{ y: "100%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-white/65 text-base sm:text-lg leading-relaxed"
      >
        {text}
      </motion.p>
    </div>
  );
}
