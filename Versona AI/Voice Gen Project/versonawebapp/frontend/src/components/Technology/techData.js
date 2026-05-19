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
    name: "inner-orbit",
    radius: 105,
    duration: 34,
    direction: "normal",
    offset: 0,
    items: [
      { name: "React", icon: reactLogo },
      { name: "Python", icon: pythonLogo },
      { name: "AI", icon: aiLogo },
    ],
  },
  {
    name: "middle-orbit",
    radius: 175,
    duration: 52,
    direction: "reverse",
    offset: 35,
    items: [
      { name: "MongoDB", icon: mongoLogo },
      { name: "Tailwind", icon: tailwindLogo },
      { name: "Machine Learning", icon: machinelearningLogo },
    ],
  },
  {
    name: "outer-orbit",
    radius: 230,
    duration: 72,
    direction: "normal",
    offset: 18,
    items: [
      { name: "JavaScript", icon: javascriptLogo },
      { name: "Docker", icon: dockerLogo },
      { name: "PyTorch", icon: pytorchLogo },
    ],
  },
];