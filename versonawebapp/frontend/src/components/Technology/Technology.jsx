import React from "react";
import { motion } from "framer-motion";

// Background
import Starfield from "./Starfield";
import SolarSystem from "./SolarSystem";

// (we will add these later)
// import SolarSystem from "./SolarSystem";

export default function Technology() {
  // Main Technology section container
  // py-20: vertical padding (top and bottom) of 5rem (80px) in css
  return (
    <section
      id="technology"
      className="
        relative 
        overflow-hidden 
        bg-black
        min-h-screen
        z-10
        py-20
        sm:py-24 
        lg:py-28  
      "
    >
      

      {/* ============================= */}
      {/* Layer 1: Night sky background */}
      {/* ============================= */}
      <Starfield />

      {/* Subtle space glow (adds depth) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_50%_35%,rgba(139,92,246,0.15),transparent_60%)]" />

      {/* ============================= */}
      {/* Layer 2 & 3 wrapper */}
      {/* ============================= */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ---------- Heading ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 lg:mb-10"
        >

          {/* on small screens and above (like tablets), the font size is 5xl. On large screens and above (like desktops), it's 6xl.*/} 
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight"> 
            {/* text-blue-500 sm:text-blue-600 lg:text-blue-700 font-semibold tracking-tight*/}
            Technology
          </h2>
          
          {/* text-blue-600: This will set the text to a blue color. You can change the number (e.g., blue-500, blue-700) to adjust the shade. */}
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-white/60">
            Built on a modern stack designed for performance, scale, and clarity.
          </p>
        </motion.div>

        {/* ---------- Solar system area ---------- */}
            <div
              className="
                relative 
                mx-auto 
                flex 
                items-center 
                justify-center
                w-full
                max-w-[700px]
                h-[420px]
                sm:h-[520px]
                lg:h-[560px]
          "
        >
          {/* We will mount SolarSystem here */}
        <SolarSystem />

        </div>

      </div>
    </section>
  );
}
