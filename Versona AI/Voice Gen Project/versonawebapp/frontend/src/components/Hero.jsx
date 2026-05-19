import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import ParticleBackground from "./ParticleBackground";
import UrduLetters from "./UrduLetters";

function SpeakerIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 24 24" aria-hidden="true" className="opacity-95">
      <path
        fill="currentColor"
        d="M3 10v4a2 2 0 0 0 2 2h2.3l4.7 3.6c.9.7 2.2.05 2.2-1.1V5.5c0-1.15-1.3-1.8-2.2-1.1L7.3 8H5a2 2 0 0 0-2 2Z"
      />
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M16 9.1c1 .9 1.6 1.8 1.6 2.9s-.6 2-1.6 2.9" />
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M18.5 7.2c1.8 1.7 2.8 3.1 2.8 4.8s-1 3.1-2.8 4.8" />
    </svg>
  );
}

function PremiumRevealText({ text, className = "", delay = 250 }) {
  const chars = "01AIUrduVersona";
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef(null);

  const reveal = () => {
    clearInterval(intervalRef.current);

    let frame = 0;
    const totalFrames = 34;

    intervalRef.current = setInterval(() => {
      frame++;

      const progress = frame / totalFrames;
      const revealCount = Math.floor(progress * text.length);

      const next = text
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < revealCount) return char;

          if (Math.random() > 0.55) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      setDisplay(next);

      if (frame >= totalFrames) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, 38);
  };

  useEffect(() => {
    const timer = setTimeout(reveal, delay);
    return () => {
      clearTimeout(timer);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <span onMouseEnter={reveal} className={className}>
      {display}
    </span>
  );
}

function VoiceCoreVisual({ scrollBoost = 0 }) {
  const scaleBoost = 1 + scrollBoost * 0.05;
  const glowBoost = 0.16 + scrollBoost * 0.14;

  return (
    <motion.div
      aria-hidden="true"
      className="relative mx-auto flex h-[240px] w-[240px] items-center justify-center sm:h-[285px] sm:w-[285px] lg:h-[330px] lg:w-[330px]"
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle at 35% 30%, rgba(167,139,250,0.34), transparent 60%),
                       radial-gradient(circle at 70% 75%, rgba(139,92,246,0.28), transparent 62%)`,
        }}
        animate={{ opacity: [0.65, 0.95, 0.65] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: "rgba(167,139,250,0.18)" }}
          animate={{
            scale: [1 * scaleBoost, (1.18 + i * 0.13) * scaleBoost],
            opacity: [0, 0.42 + scrollBoost * 0.14, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.42,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-[12%] overflow-hidden rounded-full border border-white/10 backdrop-blur-md"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.11), rgba(255,255,255,0.04) 40%, rgba(139,92,246,0.12) 70%, rgba(11,11,11,0.62) 100%)",
          boxShadow: `0 0 0 1px rgba(255,255,255,0.06),
                      0 34px 140px rgba(139,92,246,${glowBoost})`,
        }}
        animate={{ scale: [1, 1.015 + scrollBoost * 0.015, 1] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute -inset-[35%] rotate-[18deg]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), rgba(255,255,255,0.16), rgba(255,255,255,0.06), transparent)",
          }}
          animate={{ x: ["-70%", "70%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 grid h-[54%] w-[54%] place-items-center rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(167,139,250,0.70), rgba(139,92,246,0.28) 55%, rgba(0,0,0,0.35) 100%)",
          boxShadow: `0 0 90px rgba(167,139,250,${0.18 + scrollBoost * 0.22})`,
        }}
        animate={{ rotate: [0, 1.6, 0, -1.6, 0], scale: [1, 1.008, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="text-white"
          style={{
            filter:
              "drop-shadow(0 0 14px rgba(167,139,250,0.55)) drop-shadow(0 0 30px rgba(139,92,246,0.22))",
          }}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <SpeakerIcon />
        </motion.div>

        <motion.div
          className="absolute bottom-[18%] h-[10px] w-[66%] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(167,139,250,0), rgba(167,139,250,0.42), rgba(139,92,246,0.52), rgba(167,139,250,0.42), rgba(167,139,250,0))",
          }}
          animate={{ opacity: [0.35, 0.85, 0.35], scaleX: [0.9, 1.06, 0.9] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const scrollBoost = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const [boost, setBoost] = useState(0);

  useEffect(() => {
    const unsub = scrollBoost.on("change", (v) =>
      setBoost(Math.max(0, Math.min(1, v)))
    );

    return () => unsub();
  }, [scrollBoost]);

  return (
    <section id="about" className="relative min-h-[100svh] overflow-hidden bg-jet-black">
      <ParticleBackground />

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ y: [0, 16, 0], x: [0, -10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "blur(0.2px)" }}
        >
          <UrduLetters />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/60" />
      </motion.div>

      <div className="pointer-events-none absolute -top-44 left-1/2 h-[780px] w-[780px] -translate-x-1/2 rounded-full bg-iris-600/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-60 right-[-240px] h-[760px] w-[760px] rounded-full bg-iris-700/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl section-padding">
        <div className="flex min-h-[100svh] items-center pb-14 pt-28 sm:pt-32">
          <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <h1 className="text-[44px] font-semibold leading-[1.01] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">
                Create{" "}
                <PremiumRevealText
                  text="natural Urdu"
                  delay={350}
                  className="inline-block bg-gradient-to-r from-[#FFFFFF] via-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(167,139,250,0.18)]"
                />
                <br />
                speech with{" "}
                <PremiumRevealText
                  text="AI"
                  delay={750}
                  className="inline-block bg-gradient-to-r from-[#F5F3FF] via-[#A78BFA] to-[#8B5CF6] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                />
                <span className="text-white/45">.</span>
              </h1>

              <motion.p
                className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg lg:mx-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.75, ease: "easeOut" }}
              >
                Turn Urdu text and voice into clean, expressive, studio quality audio.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.75, ease: "easeOut" }}
              >
                <Link to="/signup">
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                    <span className="ring-btn">
                      <span className="px-[28px] py-[15px] text-[16px] font-semibold sm:text-[17px]">
                        Start creating
                      </span>
                    </span>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.button
                type="button"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition hover:text-white/75"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.6 }}
              >
                <span>Scroll</span>
                <motion.span
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center justify-center"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M12 16.5 5.8 10.3l1.4-1.4L12 13.7l4.8-4.8 1.4 1.4L12 16.5Z"
                    />
                  </svg>
                </motion.span>
              </motion.button>
            </motion.div>

            <div className="flex justify-center lg:justify-end">
              <VoiceCoreVisual scrollBoost={boost} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}