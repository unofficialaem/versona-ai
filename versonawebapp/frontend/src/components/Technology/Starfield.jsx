import React, { useMemo } from "react";
import { motion } from "framer-motion"; //This is a tool from Framer Motion that lets us animate HTML elements like div, span, etc.

/*
  Starfield component
  -------------------
  This creates tiny glowing stars in the background.
  They gently fade in and out (twinkling effect).
*/

export default function Starfield() {  //This is the main function that returns the JSX for the component.
  // Create stars only once (performance friendly)
  const stars = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,        // star size (1px – 3px)
      top: Math.random() * 100,           // vertical position (%)
      left: Math.random() * 100,          // horizontal position (%)
      duration: Math.random() * 4 + 3,    // twinkle speed
      delay: Math.random() * 5,           // random start time
      opacity: Math.random() * 0.5 + 0.3, // brightness
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-white" 
          style={{
            width: star.size,
            height: star.size,
            top: `${star.top}%`,
            left: `${star.left}%`,  //Random horizontal position on the screen (percentage from left to right).
            opacity: star.opacity,  //Random brightness for each star (between 0.3 and 0.8).
          }}
          animate={{
            opacity: [star.opacity, 0.15, star.opacity],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,  //// Delay before starting the twinkle
          }}
        />
      ))}
    </div>
  );
}
