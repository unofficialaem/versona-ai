import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { name: "About", id: "about" },
      { name: "Features", id: "features" },
      { name: "Technology", id: "technology" },
      { name: "FAQ", id: "faq" },
    ],
    []
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => window.innerWidth >= 768 && setMobileOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollToId = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (!el) return;

    const NAV_OFFSET = 84;
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, y - NAV_OFFSET), behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[9999] isolate">
      {/* backdrop */}
      <div
        className={[
          "absolute inset-0 pointer-events-none transition-all duration-300",
          scrolled
            ? "bg-jet-white/55 backdrop-blur-md"
            : "bg-jet-white/25 backdrop-blur-sm",
        ].join(" ")}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* LEFT brand */}
          <motion.div
            animate={{ opacity: scrolled ? 0 : 1, x: scrolled ? -8 : 0 }} //Brand fades away when scrolling
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className={[
              "flex items-center gap-2",
              scrolled ? "pointer-events-none" : "pointer-events-auto",
            ].join(" ")}
          >
            <Link to="/" className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-iris-500 shadow-[0_0_18px_rgba(139,92,246,.85)]" />  {/* Purple dot */}
              <span className="text-sm font-semibold tracking-wide text-white">
                versona
              </span>
            </Link>
          </motion.div>

          {/* ✅ CENTER pill (COMPACT HEIGHT FIX) */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className={[
                "w-fit",
                "h-9", // ✅ force pill height (removes extra space)
                "flex items-center",
                "rounded-full",
                "border border-white bg-jet-white backdrop-blur-xl",
                "shadow-[0_12px_60px_rgba(0,0,1,0.55)]",
                "px-1.5", // ✅ small horizontal padding
              ].join(" ")}
            >
              <div className="flex items-center gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToId(item.id)}
                    className={[
                      "h-8", // ✅ force button height
                      "px-3",
                      "rounded-full",
                      "text-sm", // matches versona text size
                      "leading-none", // ✅ kills extra vertical spacing
                      "font-medium",
                      "text-white/75 hover:text-white hover:bg-white/5 transition",
                    ].join(" ")}
                  >
                    {item.name}
                  </button>
                ))}

                {/* Signup inside pill when scrolled */}
                <motion.div
                  animate={{
                    opacity: scrolled ? 1 : 0,
                    scale: scrolled ? 1 : 0.98,
                    width: scrolled ? "auto" : 0,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  className={[
                    "overflow-hidden",
                    scrolled ? "pl-1" : "pl-0", //Adds padding-left depending on scroll state
                    scrolled ? "pointer-events-auto" : "pointer-events-none",  //Changes pointer events depending on scroll state
                  ].join(" ")} //JavaScript array method.It joins all elements of the array into a single string, separated by " "
                >
                  <Link to="/signup">
                    <span className="ring-btn">
                      <span>Sign up</span>
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT auth */}
          <motion.div
            animate={{ opacity: scrolled ? 0 : 1, x: scrolled ? 8 : 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className={[
              "hidden md:flex items-center gap-4",
              scrolled ? "pointer-events-none" : "pointer-events-auto",
            ].join(" ")}
          >
            <Link
              to="/login"
              className="text-sm font-semibold text-white/75 hover:text-white transition"
            >
              Log in
            </Link>

            <Link to="/signup">
              <span className="ring-btn">
                <span>Sign up</span>
              </span>
            </Link>
          </motion.div>

          {/* MOBILE toggle */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-2 text-white/85 hover:bg-white/10 transition"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
