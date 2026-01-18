import React, { useRef } from "react";  
import { motion, useAnimationFrame } from "framer-motion";
import { TECH_ORBITS } from "./techData";

/**
 * SolarSystem
 * --------------------------------
 * Central "sun" + static orbit rings
 * Tech icons revolve independently
 */
export default function SolarSystem() {
  return (
    <div className="relative mx-auto w-full max-w-[600px] aspect-square">
      {/* ===== SUN ===== */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 140,
            height: 140,
            background:
              "radial-gradient(circle at top, #c4b5fd, #7c3aed 60%, #4c1d95)",
            boxShadow: "0 0 60px rgba(139,92,246,0.6)",
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <span className="text-white font-semibold tracking-wide">
            Versona
          </span>
        </motion.div>
      </div>

      {/* ===== ORBITS ===== */}
      {TECH_ORBITS.map((orbit, i) => (
        <Orbit key={i} orbit={orbit} />
      ))}
    </div>
  );
}

/**
 * Orbit
 * --------------------------------
 * Static circular ring + nodes
 */
function Orbit({ orbit }) {
  const angleRef = React.useRef(0);

  // One animation loop PER ORBIT
  useAnimationFrame((_, delta) => {
    angleRef.current += orbit.speed * delta;
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Orbit ring */}
      <div
        className="absolute rounded-full border border-white/10"
        style={{
          width: orbit.radius * 2,
          height: orbit.radius * 2,
        }}
      />

      {/* Orbiting technologies */}
      {orbit.items.map((item, index) => (
        <TechNode
          key={item.name}
          item={item}
          radius={orbit.radius}
          baseAngle={angleRef}
          index={index}
          total={orbit.items.length}
        />
      ))}
    </div>
  );
}


/**
 * TechNode
 * --------------------------------
 * One technology icon
 * Moves smoothly & randomly on orbit
 */
function TechNode({ item, radius }) {
  const ref = useRef();

  // Randomized motion config (runs once)
  const config = React.useMemo(() => {
    return {
      startAngle: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.6,
    };
  }, []);

  useAnimationFrame((time) => {
    const t = time / 1000;
    const angle = config.startAngle + t * config.speed;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (ref.current) {
      ref.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  });

  return (
    <div ref={ref} className="absolute">
      <div className="h-12 w-12 rounded-full bg-black/60 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
        <img
          src={item.icon}
          alt={item.name}
          className="h-6 w-6 object-contain"
        />
      </div>
    </div>
  );
}
