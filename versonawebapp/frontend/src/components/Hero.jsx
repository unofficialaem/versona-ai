import React, { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import ParticleBackground from "./ParticleBackground";
import UrduLetters from "./UrduLetters";

/* -------------------------------------------------------
  Premium Speaker Icon (SVG)
  - Clean (no emoji)
  - Looks modern with glow + subtle wave pulse
-------------------------------------------------------- */
function SpeakerIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="opacity-95"
    >
      {/* speaker body */}
      <path
        fill="currentColor"
        d="M3 10v4a2 2 0 0 0 2 2h2.3l4.7 3.6c.9.7 2.2.05 2.2-1.1V5.5c0-1.15-1.3-1.8-2.2-1.1L7.3 8H5a2 2 0 0 0-2 2Z"
      />
      {/* waves */}
      <path
        fill="none"
        stroke="currentColor"   
        strokeWidth="1.6"
        strokeLinecap="round"
        d="M16 9.1c1 .9 1.6 1.8 1.6 2.9s-.6 2-1.6 2.9"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        d="M18.5 7.2c1.8 1.7 2.8 3.1 2.8 4.8s-1 3.1-2.8 4.8"
      />
    </svg>
  );
}

/* -------------------------------------------------------
  Right side "VoiceCore" visual
  - Purple glass orb
  - Reflection sweep
  - Rings
  - Pulse boosts slightly on scroll (feels alive)
-------------------------------------------------------- */
function VoiceCoreVisual({ scrollBoost = 0 }) {
  const scaleBoost = 1 + scrollBoost * 0.05;
  const glowBoost = 0.16 + scrollBoost * 0.14;

  return (
    <motion.div
      aria-hidden="true"
      className="relative mx-auto flex h-[240px] w-[240px] items-center justify-center sm:h-[285px] sm:w-[285px] lg:h-[330px] lg:w-[330px]"
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
    >
      {/* soft glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle at 35% 30%, rgba(167,139,250,0.34), transparent 60%),
                       radial-gradient(circle at 70% 75%, rgba(139,92,246,0.28), transparent 62%)`,
        }}
        animate={{ opacity: [0.65, 1, 0.65] }}  /* breathe in and out */
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}  /* infinite loop */
      />

      {/* expanding rings */}
      {[0, 1, 2].map((i) => ( /* Loop runs 3 times Creates 3 rings*/
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: "rgba(167,139,250,0.22)" }}
          animate={{  /* Ring expands Becomes visible Fades out Each ring slightly larger than previous */
            scale: [1 * scaleBoost, (1.2 + i * 0.14) * scaleBoost],
            opacity: [0, 0.55 + scrollBoost * 0.18, 0],
          }}
          transition={{
            duration: 2.35,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.32,
          }}
        />
      ))}

      {/* glass orb */}
      <motion.div
        className="absolute inset-[12%] rounded-full border border-white/10 backdrop-blur-md overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.10), rgba(255,255,255,0.04) 40%, rgba(139,92,246,0.12) 70%, rgba(11,11,11,0.6) 100%)",
          boxShadow: `0 0 0 1px rgba(255,255,255,0.06),
                      0 34px 140px rgba(139,92,246,${glowBoost})`,
        }}
        animate={{ scale: [1, 1.02 + scrollBoost * 0.02, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* reflection sweep */}
        <motion.div
          className="absolute -inset-[35%] rotate-[18deg]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), rgba(255,255,255,0.18), rgba(255,255,255,0.07), transparent)",
          }}
          animate={{ x: ["-70%", "70%"] }}
          transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* inner core */}
      <motion.div
        className="relative z-10 grid place-items-center h-[54%] w-[54%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(167,139,250,0.70), rgba(139,92,246,0.28) 55%, rgba(0,0,0,0.35) 100%)",
          boxShadow: `0 0 90px rgba(167,139,250,${0.18 + scrollBoost * 0.22})`,
        }}
        /*Slight rotation → alive feeling*/
        animate={{ rotate: [0, 2.5, 0, -2.5, 0], scale: [1, 1.01, 1] }}  
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* ✅ Clean speaker icon (no emoji) */}
        <motion.div
          className="text-white"   /*White speaker icon*/
          style={{
            filter:
              "drop-shadow(0 0 14px rgba(167,139,250,0.55)) drop-shadow(0 0 30px rgba(139,92,246,0.22))",
          }}
          animate={{ y: [0, -2, 0] }}   /*Floating effect*/
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <SpeakerIcon />
        </motion.div>

        {/* tiny wave under icon */}
        <motion.div
          className="absolute bottom-[18%] h-[10px] w-[66%] rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(167,139,250,0.0), rgba(167,139,250,0.45), rgba(139,92,246,0.55), rgba(167,139,250,0.45), rgba(167,139,250,0.0))",
          }}
          animate={{ opacity: [0.35, 0.9, 0.35], scaleX: [0.88, 1.08, 0.88] }}
          transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  // Scroll-driven boost (0..1) to make orb feel more alive while scrolling
  const { scrollYProgress } = useScroll();
  const scrollBoost = useTransform(scrollYProgress, [0, 0.35], [0, 1]);   // scroll at rest when clicked move from 0 to 1

  const [boost, setBoost] = useState(0);
  useEffect(() => {
    const unsub = scrollBoost.on("change", (v) => setBoost(Math.max(0, Math.min(1, v)))); 
    return () => unsub();  // Cleanup listener
  }, [scrollBoost]); 

  // Gradient ONLY on "alive" , urdu (light → darker purple)
  const aliveGradient = useMemo(
    () => ({
      background:
        "linear-gradient(90deg, rgba(216,180,254,1), rgba(167,139,250,1), rgba(139,92,246,1))",
      WebkitBackgroundClip: "text",
      color: "transparent",  
    }),
    []
  );

  return (
    <section
    id ="about" 
    className="relative min-h-[100svh] overflow-hidden bg-jet-black">
      <ParticleBackground />

      {/* Urdu letters drift in the background (subtle + premium) */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ y: [0, 16, 0], x: [0, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "blur(0.2px)" }}
        >
          <UrduLetters />
        </motion.div>

        {/* vignette for readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/60" />
      </motion.div>

      {/* Purple-only ambient glows */}
      <div className="pointer-events-none absolute -top-44 left-1/2 h-[780px] w-[780px] -translate-x-1/2 rounded-full bg-iris-600/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-60 right-[-240px] h-[760px] w-[760px] rounded-full bg-iris-700/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl section-padding">
        <div className="min-h-[100svh] pt-28 sm:pt-32 pb-14 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* LEFT: headline + subtext + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              

              <h1 className="mt-6 text-[38px] leading-[1.05] sm:text-6xl md:text-7xl font-semibold tracking-tight text-white">
                Make your <span style={aliveGradient}>Urdu</span>  voice
                <br />
                feel <span style={aliveGradient}>alive</span>
                <span className="text-white/70">.</span>
              </h1>

              <p className="mt-5 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg md:text-xl text-white/70">
                Write your script, pick a style, and generate studio clean audio in seconds,
                crisp pronunciation, natural rhythm, and a premium feel.
              </p>

              {/* CTA (same style as navbar signup button) */}
              <div className="mt-8 flex flex-col items-center lg:items-start">
                <Link to="/signup">
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }}>
                    <span className="ring-btn">
                      <span className="px-[26px] py-[15px] text-[16px] sm:text-[17px] font-semibold">
                        Start creating
                      </span>
                    </span>
                  </motion.div>
                </Link>

                {/* ✅ Scroll hint (the cool “down” thing ) */}
                <motion.button
                  type="button"
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/55 hover:text-white/80 transition"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                >
                  <span className="text-white/55">Scroll</span>
                  <motion.span
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.25, repeat: Infinity, ease: "easeInOut" }}
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
              </div>
            </motion.div>

            {/* RIGHT: visual orb */}
            <div className="flex justify-center lg:justify-end">
              <VoiceCoreVisual scrollBoost={boost} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
