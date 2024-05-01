"use client";
import { Stars } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import React, { useEffect, useCallback } from "react";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";
// const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
const COLORS_TOP = [""];
const MouseMoveEffect = () => {
  const { camera } = useThree();
  const handleMouseMove = useCallback(
    (event: any) => {
      const { clientX, clientY } = event;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const x = (clientX / width) * 2 - 1;
      const y = -(clientY / height) * 2 + 1;
      camera.position.x = x * 0.5;
      camera.position.y = y * 0.5;
      camera.lookAt(2, 2, 2);
    },
    [camera]
  );
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);
  return null;
};

export const AuroraHero = ({ children }: { children: React.ReactNode }) => {
  const color = useMotionValue(COLORS_TOP[0]);
  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, [color]);
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  return (
    <motion.section
      style={{
        backgroundImage,
        paddingTop: "0vh",
        paddingBottom: "0vh",
        minHeight: "100vh",
      }}
      className="relative grid place-content-center bg-gray-950 px-4 py-1 text-gray-200"
    >
      <div className="absolute inset-0 z-0">
        <Canvas>
          <MouseMoveEffect />
          <Stars radius={50} count={5500} factor={5} fade speed={4} />
        </Canvas>
      </div>
      <div className="relative">{children}</div>
    </motion.section>
  );
};
