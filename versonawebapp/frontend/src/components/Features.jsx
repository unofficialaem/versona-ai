import React from "react";
import { motion } from "framer-motion";

export default function Features() {
  const items = [  // items is an array (list) that holds 7 features
    { title: "Text to Speech", subtitle: "Natural Urdu voice", Icon: WaveBarsIcon },
    {
      title: "Voice Cloning",
      subtitle: "Clone a voice from a short sample",
      Icon: SparkIcon,
    },
    { title: "Audio to Audio", subtitle: "Same words, new voice", Icon: SwapIcon },
    { title: "History", subtitle: "Track past exports", Icon: HistoryIcon },
    { title: "Preview", subtitle: "Listen before download", Icon: EyeIcon },
    { title: "Download", subtitle: "Ready to ship files", Icon: DownloadIcon },
    { title: "Secure", subtitle: "Private by default", Icon: LockIcon },
  ];

  // container for the feature list. It's like a box holding all the feature items inside.
  return (
    <section id="features" className="relative py-20">  
      {/* section background (subtle, no motion) */}

      {/* background glow effect behind the features. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_-10%,rgba(139,92,246,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_12%_70%,rgba(139,92,246,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_88%_70%,rgba(139,92,246,0.08),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* BIG PREMIUM PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}  //When the panel comes into the view, it will fade in and move to the correct position (y: 0).
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: "easeOut" }} //The transition will last 0.6 seconds and will use an "easeOut" easing function for a smooth effect.
          className="feature-panel rounded-[38px] border border-white/10 overflow-hidden"
        >
          <div className="relative px-6 py-14 sm:px-10 sm:py-16">
            {/* depth overlays */}
            <div className="pointer-events-none absolute inset-0 feature-panel-glow" />
            <div className="pointer-events-none absolute inset-0 feature-grain opacity-[0.18]" />

            {/* headline */}
            <div className="text-center">
              <h2 className="text-[36px] sm:text-[46px] md:text-[56px] font-semibold leading-[1.08] tracking-tight text-white">
                Everything You Need For Urdu Voice{" "}
                <span
                  className="bg-gradient-to-r from-[#F3E8FF] via-[#C4B5FD] to-[#7C3AED] bg-clip-text text-transparent"
                  style={{ textShadow: "0 12px 45px rgba(0,0,0,0.55)" }}
                >
                  Creation
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-base sm:text-lg text-white/60 leading-relaxed">
                A clean set of tools for Urdu voice creation. Fast to use, premium to export.
              </p>
            </div>

            {/* icon tiles (NO CONNECTING LINE) */}
            {/* Feature Icons Grid*/}
            <div className="mt-12">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 lg:grid-cols-7">
                {items.map((it, idx) => (
                  <motion.div
                    key={it.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: idx * 0.04 }}
                    whileHover={{ y: -4 }}
                    className="group text-center"
                  >
                    <div
  className="
    mx-auto flex h-16 w-16 items-center justify-center
    rounded-2xl
    bg-[#141414]         /* dark solid interior */
    border border-[#8B5CF6]/35
    backdrop-blur-md
    transition-all duration-300
    shadow-[0_14px_40px_rgba(0,0,0,0.55)]
    group-hover:border-[#8B5CF6]/70
    group-hover:shadow-[0_0_45px_rgba(139,92,246,0.35)]
  "
>
  <it.Icon />
</div>



                    <div className="mt-4 text-sm font-semibold text-white/85 group-hover:text-white transition">
                      {it.title}
                    </div>

                    <div className="mt-1 text-xs text-white/45 leading-snug">
                      {it.subtitle}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* bottom fade for depth */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =======================
   Icons (clean, no emoji)
   ======================= */

function IconBase({ children }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="text-white/85">
      {children}
    </svg>
  );
}

function WaveBarsIcon() {
  return (
    <IconBase>
      <path fill="currentColor" d="M3 10h2v4H3v-4Zm4-4h2v12H7V6Zm4 2h2v8h-2V8Zm4-5h2v18h-2V3Zm4 7h2v4h-2v-4Z" />
    </IconBase>
  );
}

function SparkIcon() {
  return (
    <IconBase>
      <path fill="currentColor" d="M12 2l1.2 4.2L17.4 7.4l-4.2 1.2L12 12.8l-1.2-4.2L6.6 7.4l4.2-1.2L12 2Zm7 8l.8 2.8 2.8.8-2.8.8L19 17.2l-.8-2.8-2.8-.8 2.8-.8L19 10ZM5 14l.9 3.1 3.1.9-3.1.9L5 22l-.9-3.1L1 18l3.1-.9L5 14Z" />
    </IconBase>
  );
}

function SwapIcon() {
  return (
    <IconBase>
      <path fill="currentColor" d="M7 7h11l-2-2 1.4-1.4L22.8 9l-5.4 5.4L16 13l2-2H7V7Zm10 10H6l2 2-1.4 1.4L1.2 15l5.4-5.4L8 11l-2 2h11v4Z" />
    </IconBase>
  );
}

function HistoryIcon() {
  return (
    <IconBase>
      <path fill="currentColor" d="M13 3a9 9 0 1 0 8.95 10h-2.02A7 7 0 1 1 13 5a6.96 6.96 0 0 1 4.95 2.05L16 9h6V3l-2.64 2.64A8.96 8.96 0 0 0 13 3Zm-1 5h2v6h-5v-2h3V8Z" />
    </IconBase>
  );
}

function EyeIcon() {
  return (
    <IconBase>
      <path fill="currentColor" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" />
    </IconBase>
  );
}

function DownloadIcon() {
  return (
    <IconBase>
      <path fill="currentColor" d="M12 3a1 1 0 0 1 1 1v9.6l2.3-2.3 1.4 1.4-4.7 4.7-4.7-4.7 1.4-1.4 2.3 2.3V4a1 1 0 0 1 1-1ZM5 19h14v2H5v-2Z" />
    </IconBase>
  );
}

function LockIcon() {
  return (
    <IconBase>
      <path fill="currentColor" d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2ZM10 7a2 2 0 0 1 4 0v2h-4V7Z" />
    </IconBase>
  );
}
