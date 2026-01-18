import { motion } from "framer-motion";

/**
 * Footer
 * ------------------------
 * Minimal, calm, pre-launch footer
 * Clear visual separation from content above
 */
export default function Footer() {
  return (
    <footer className="relative bg-[#070707] overflow-hidden">
      {/* 🔹 Top divider — makes it feel like a footer */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_50%_120%,rgba(139,92,246,0.14),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center text-center gap-6"
        >
          {/* Brand */}
          <span className="text-lg font-semibold tracking-wide text-white/90">
            Versona
          </span>

          {/* Short mission line */}
          <p className="max-w-md text-sm sm:text-base text-white/55 leading-relaxed">
            A calm, modern approach to Urdu voice — built with clarity, care,
            and respect for language.
          </p>

          {/* Soft divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Bottom meta */}
          <div className="text-xs text-white/40">
            © {new Date().getFullYear()} Versona. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
