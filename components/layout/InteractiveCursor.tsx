"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function InteractiveCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast spring for the inner precision ring
  const ringX = useSpring(mouseX, { stiffness: 420, damping: 28, mass: 0.4 });
  const ringY = useSpring(mouseY, { stiffness: 420, damping: 28, mass: 0.4 });

  // Smooth trailing spring for the ambient spotlight aura
  const glowX = useSpring(mouseX, { stiffness: 160, damping: 26, mass: 0.7 });
  const glowY = useSpring(mouseY, { stiffness: 160, damping: 26, mass: 0.7 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest(
        'a, button, [role="button"], input, select, textarea, label, .interactive-hover'
      );
      setIsHovered(Boolean(interactiveEl));

      const spotlightCard = target.closest(".hover-spotlight") as HTMLElement | null;
      if (spotlightCard) {
        const rect = spotlightCard.getBoundingClientRect();
        spotlightCard.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        spotlightCard.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, visible]);

  if (!enabled) return null;

  return (
    <>
      {/* Ambient Trailing Spotlight Glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9990] hidden lg:block rounded-full"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovered ? 340 : 260,
          height: isHovered ? 340 : 260,
          opacity: visible ? (isHovered ? 0.14 : 0.08) : 0,
          background: isHovered
            ? "radial-gradient(circle, rgba(185,28,28,0.45) 0%, rgba(21,128,61,0.22) 45%, transparent 72%)"
            : "radial-gradient(circle, rgba(185,28,28,0.32) 0%, rgba(15,23,42,0.08) 50%, transparent 72%)",
          transition: "width 0.3s ease, height 0.3s ease, opacity 0.3s ease",
        }}
      />

      {/* Precision Magnetic Cursor Ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden lg:flex items-center justify-center rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isPressed ? 22 : isHovered ? 40 : 24,
          height: isPressed ? 22 : isHovered ? 40 : 24,
          opacity: visible ? 1 : 0,
          scale: isPressed ? 0.88 : 1,
          borderColor: isHovered ? "rgba(185, 28, 28, 0.55)" : "rgba(15, 23, 42, 0.22)",
          backgroundColor: isHovered ? "rgba(185, 28, 28, 0.06)" : "rgba(255, 255, 255, 0.0)",
        }}
        transition={{ duration: 0.16, ease: "easeOut" }}
      >
        <div
          className={`rounded-full transition-all duration-150 ${
            isHovered
              ? "h-1.5 w-1.5 bg-[#b91c1c] shadow-[0_0_8px_rgba(185,28,28,0.8)]"
              : "h-1 w-1 bg-slate-900/40"
          }`}
        />
      </motion.div>
    </>
  );
}
