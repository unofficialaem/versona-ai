import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is VERSONA designed for?",
    answer:
      "VERSONA turns Urdu text into clear, expressive, natural-sounding speech using AI-powered voice synthesis.",
  },
  {
    question: "Does VERSONA clone a user’s voice?",
    answer:
      "No. VERSONA does not perform real-time voice cloning. It uses pre-trained embedded Urdu voice styles available inside the system.",
  },
  {
    question: "Can I choose different voice styles?",
    answer:
      "Yes. You can choose from available pre-trained voices and generate speech that fits your content style.",
  },
  {
    question: "Can I preview generated audio?",
    answer:
      "Yes. You can listen to the generated audio before downloading the final output.",
  },
  {
    question: "What makes VERSONA useful?",
    answer:
      "It gives users a simple workflow for producing polished Urdu audio with better clarity, rhythm, and presentation quality.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-jet-black py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-240px] top-20 h-[520px] w-[520px] rounded-full bg-iris-600/10 blur-3xl" />
        <div className="absolute right-[-260px] bottom-0 h-[560px] w-[560px] rounded-full bg-iris-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          {/* LEFT SIDE */}
          {/* LEFT SIDE */}
<motion.div
  initial={{ opacity: 0, y: 18 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.65, ease: "easeOut" }}
  className="lg:sticky lg:top-28"
>
  <h2 className="max-w-md text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-[38px] md:text-[44px]">
    Built to make Urdu voice creation feel{" "}
    <span className="bg-gradient-to-r from-white via-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent">
      simple.
    </span>
  </h2>

  <p className="mt-5 max-w-md text-base leading-relaxed text-white/55">
    Clear answers about how VERSONA generates speech, uses pre-trained voices,
    and prepares audio before export.
  </p>

  <div className="mt-7 space-y-3 max-w-md">
    {[
      "Pre-trained Urdu voice styles",
      "Clean pronunciation and rhythm",
      "Preview audio before download",
    ].map((item) => (
      <div
        key={item}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/60 backdrop-blur-xl"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-iris-300 shadow-[0_0_14px_rgba(167,139,250,0.8)]" />
        {item}
      </div>
    ))}
  </div>
</motion.div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.035] p-3 shadow-[0_40px_140px_rgba(124,58,237,0.14)] backdrop-blur-xl"
          >
            {/* animated corner glows */}
            <motion.div
              className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-iris-500/20 blur-3xl"
              animate={{ opacity: [0.35, 0.8, 0.35], scale: [1, 1.12, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-iris-700/18 blur-3xl"
              animate={{ opacity: [0.25, 0.65, 0.25], scale: [1.1, 1, 1.1] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative space-y-2">
              {faqs.map((item, index) => {
                const isOpen = openIndex === index;

                return (
                  <motion.div
                    key={item.question}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.42, delay: index * 0.045 }}
                    className={`overflow-hidden rounded-[26px] transition-all duration-300 ${
                      isOpen
                        ? "border border-iris-300/25 bg-black/38 shadow-[0_0_70px_rgba(139,92,246,0.16)]"
                        : "border border-transparent hover:bg-white/[0.035]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="flex w-full items-center gap-5 px-6 py-5 text-left"
                    >
                      <span
                        className={`text-sm font-semibold ${
                          isOpen ? "text-iris-200" : "text-white/28"
                        }`}
                      >
                        0{index + 1}
                      </span>

                      <span className="flex-1 text-base font-semibold tracking-[-0.015em] text-white/88 sm:text-lg">
                        {item.question}
                      </span>

                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.25 }}
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-lg ${
                          isOpen
                            ? "border-iris-300/30 bg-iris-500/10 text-iris-100"
                            : "border-white/10 bg-white/[0.04] text-white/50"
                        }`}
                      >
                        +
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                          <div className="px-6 pb-6 pl-[68px] text-sm leading-relaxed text-white/58 sm:text-[15px]">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}