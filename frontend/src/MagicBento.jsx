import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function MagicBento({
  children,
  className = "",
  glowColor = "16, 185, 129", // Default Emerald Glow
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
        spotlightRef.current.style.background = `radial-gradient(420px circle at ${x}px ${y}px, rgba(${glowColor}, 0.14), transparent 42%)`;
      }
      if (enableBorderGlow && borderGlowRef.current) {
        borderGlowRef.current.style.background = `radial-gradient(280px circle at ${x}px ${y}px, rgba(${glowColor}, 0.7), transparent 42%)`;
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

  return (
    <div
      ref={containerRef}
      className={`group relative isolate overflow-hidden rounded-xl border border-slate-200 transition-shadow hover:shadow-md ${className}`}
    >
      {enableSpotlight && (
        <div
          ref={spotlightRef}
          className="pointer-events-none absolute inset-0 opacity-0 z-0"
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
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
