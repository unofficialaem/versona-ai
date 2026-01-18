import { motion } from "framer-motion";
import FAQIntroText from "./FAQIntroText";
import FAQItem from "./FAQItem";

/**
 * FAQ
 * ------------------------
 * Trust-focused section
 * Calm, readable, and future-proof
 */
export default function FAQ() {
  const faqs = [
    {
      question: "What is Versona?",
      answer:
        "Versona is a modern platform for generating high-quality Urdu voice output. It’s designed to be simple to use, fast, and focused on clarity.",
    },
    {
      question: "Do I need technical knowledge to use it?",
      answer:
        "No. Versona is built for creators, not engineers. You write, choose a voice style, and generate audio — that’s it.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Yes. Your content stays private. We design our systems with security and data ownership in mind from the start.",
    },
    {
      question: "Can I use the generated audio commercially?",
      answer:
        "Usage terms will be clearly defined. Our goal is to make outputs usable and practical for real projects.",
    },
    {
      question: "Is this product ready?",
      answer:
        "Versona is actively evolving. We’re focused on quality first, and features will expand as the system matures.",
    },
  ];

  return (
    <section
      id="faq"
      className="relative py-28 sm:py-32 bg-jet-black overflow-hidden"
    >
      {/* ✅ Soft ambient background shade */}
      <div className="pointer-events-none absolute inset-0">
        {/* top glow */}
        <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_50%_0%,rgba(139,92,246,0.14),transparent_60%)]" />
        
        {/* bottom fade for smooth transition */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight"
        >
          Frequently asked questions
        </motion.h2>

        {/* Animated intro text */}
        <div className="mt-6 max-w-3xl">
          <FAQIntroText text="We believe good tools should be easy to understand. Here are a few things people usually want to know before getting started." />
        </div>

        {/* FAQ list */}
        <div className="mt-12">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
