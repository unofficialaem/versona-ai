import React from "react";
import { motion } from "framer-motion";
import { TECH_ORBITS } from "./techData";

export default function SolarSystem() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px]">
      {/* background depth */}
      <div className="pointer-events-none absolute inset-[20%] rounded-full bg-iris-600/10 blur-3xl" />

      {/* Center Core */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <motion.div
          className="relative flex h-[118px] w-[118px] items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-white/[0.10] via-iris-500/10 to-black/55 shadow-[0_0_85px_rgba(139,92,246,0.34)] backdrop-blur-xl"
          animate={{ scale: [1, 1.035, 1] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-2 rounded-full border border-white/10" />
          <div className="absolute inset-5 rounded-full bg-iris-400/10 blur-xl" />

          {/* premium shine */}
          <div className="absolute left-1/2 top-3 h-px w-14 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
          <div className="absolute -left-8 top-0 h-28 w-10 rotate-12 bg-white/10 blur-xl" />

          <div className="relative flex items-end gap-1.5">
            {[18, 30, 46, 30, 18].map((height, index) => (
            <motion.span
            key={index}
            className="w-2 rounded-full bg-gradient-to-t from-iris-700 via-iris-300 to-white shadow-[0_0_16px_rgba(167,139,250,0.45)]"
            style={{ height }}
            animate={{ scaleY: [0.78, 1.1, 0.78] }}
            transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut",
          }}
          />
        ))}
        </div>
        </motion.div>
      </div>

      {/* Orbits */}
      {TECH_ORBITS.map((orbit, index) => (
        <Orbit key={orbit.name} orbit={orbit} index={index} />
      ))}
    </div>
  );
}

function Orbit({ orbit }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="absolute rounded-full border border-white/10"
        style={{
          width: orbit.radius * 2,
          height: orbit.radius * 2,
        }}
      />

      <motion.div
        className="absolute flex items-center justify-center"
        style={{
          width: orbit.radius * 2,
          height: orbit.radius * 2,
        }}
        animate={{ rotate: orbit.direction === "reverse" ? -360 : 360 }}
        transition={{
          duration: orbit.duration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {orbit.items.map((item, itemIndex) => {
          const angle = (360 / orbit.items.length) * itemIndex + orbit.offset;

          return (
            <TechPlanet
              key={item.name}
              item={item}
              angle={angle}
              radius={orbit.radius}
              orbitDuration={orbit.duration}
              reverse={orbit.direction === "reverse"}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

function TechPlanet({ item, angle, radius, orbitDuration, reverse }) {
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
      }}
    >
      <motion.div
        className="group relative -ml-6 -mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/65 shadow-[0_18px_55px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-iris-300/70 hover:shadow-[0_0_45px_rgba(139,92,246,0.45)]"
        animate={{ rotate: reverse ? 360 : -360 }}
        transition={{
          duration: orbitDuration,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <img src={item.icon} alt={item.name} className="h-6 w-6 object-contain" />

        <div className="pointer-events-none absolute inset-0 rounded-full bg-iris-400/10 opacity-0 blur-md transition group-hover:opacity-100" />

        <div className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[11px] text-white/75 opacity-0 backdrop-blur-md transition group-hover:opacity-100">
          {item.name}
        </div>
      </motion.div>
    </div>
  );
}