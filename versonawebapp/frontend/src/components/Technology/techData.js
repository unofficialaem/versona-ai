// techData.js
// ------------------------------------
// This file defines WHAT technologies exist
// (no animation or UI logic here)

import reactLogo from "../../assets/tech/react.svg";
import pythonLogo from "../../assets/tech/python.svg";
import dockerLogo from "../../assets/tech/docker.svg";
import mongoLogo from "../../assets/tech/mongodb.svg";
import javascriptLogo from "../../assets/tech/javascript.svg";
import tailwindLogo from "../../assets/tech/tailwind.svg";
import aiLogo from "../../assets/tech/ai.svg";
import machinelearningLogo from "../../assets/tech/machinelearning.svg";
import pytorchLogo from "../../assets/tech/pytorch.svg";


export const TECH_ORBITS = [
  {
    radius: 120,
    speed: 0.25, // radians per second
    items: [
      { name: "React", icon: reactLogo },
      { name: "Python", icon: pythonLogo },
      { name: "AI", icon: aiLogo },
    ],
  },
  {
    radius: 190,
    speed: 0.18,
    items: [
      { name: "Docker", icon: dockerLogo },
      { name: "MongoDB", icon: mongoLogo },
      { name: "ML", icon: machinelearningLogo },
    ],
  },
  {
    radius: 260,
    speed: 0.12,
    items: [
      { name: "JavaScript", icon: javascriptLogo },
      { name: "Tailwind CSS", icon: tailwindLogo },
      { name: "PyTorch", icon: pytorchLogo },
    ],
  },
];
