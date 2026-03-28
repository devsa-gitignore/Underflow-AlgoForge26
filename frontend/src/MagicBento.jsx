import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MagicBento({
  children,
  className = "",
  glowColor = "14, 165, 233", // Default Sky Blue Glow for light mode
  enableSpotlight = true,
  enableBorderGlow = true,
}) {
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);
  const borderGlowRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const target = { x: 0, y: 0 };

    const updateGradients = () => {
      const { x, y } = target;
      if (enableSpotlight && spotlightRef.current) {
        // Stronger spotlight for light mode, slightly larger
        spotlightRef.current.style.background = `radial-gradient(500px circle at ${x}px ${y}px, rgba(${glowColor}, 0.15), transparent 45%)`;
      }
      if (enableBorderGlow && borderGlowRef.current) {
        borderGlowRef.current.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(${glowColor}, 0.8), transparent 50%)`;
      }
    };

    const xTo = enableSpotlight || enableBorderGlow ? gsap.quickTo(target, "x", { duration: 0.15, ease: "power3", onUpdate: updateGradients }) : null;
    const yTo = enableSpotlight || enableBorderGlow ? gsap.quickTo(target, "y", { duration: 0.15, ease: "power3", onUpdate: updateGradients }) : null;

    const syncPointer = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (xTo) xTo(x);
      if (yTo) yTo(y);
    };

    const handlePointerEnter = (e) => {
      syncPointer(e);
      if (enableSpotlight && spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 1, duration: 0.3 });
      if (enableBorderGlow && borderGlowRef.current) gsap.to(borderGlowRef.current, { opacity: 1, duration: 0.3 });
    };

    const handlePointerLeave = () => {
      if (enableSpotlight && spotlightRef.current) gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3 });
      if (enableBorderGlow && borderGlowRef.current) gsap.to(borderGlowRef.current, { opacity: 0, duration: 0.3 });
    };

    updateGradients();
    container.addEventListener('pointermove', syncPointer);
    container.addEventListener('pointerenter', handlePointerEnter);
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      container.removeEventListener('pointermove', syncPointer);
      container.removeEventListener('pointerenter', handlePointerEnter);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [enableSpotlight, enableBorderGlow, glowColor]);

  // Enhanced Light Mode glass styling on the container
  return (
    <div
      ref={containerRef}
      className={`group relative isolate overflow-hidden rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${className}`}
    >
      {enableSpotlight && (
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute inset-0 opacity-0 z-0 mix-blend-multiply"
        />
      )}
      {enableBorderGlow && (
        <div
          ref={borderGlowRef}
          className="pointer-events-none absolute -inset-px opacity-0 z-20"
          style={{
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '1px',
            borderRadius: 'inherit'
          }}
        />
      )}
      {/* Soft inner glow highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/50 z-10" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
