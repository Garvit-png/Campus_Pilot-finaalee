import React, { useEffect, useState } from 'react';

interface EventSplashProps {
  onComplete: () => void;
}

export const EventSplash: React.FC<EventSplashProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Speed up loading screen duration to 2.2 seconds for a snappier user feel
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isExiting) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 500); // Snappy 500ms fade transition out
      return () => clearTimeout(timeout);
    }
  }, [isExiting, onComplete]);

  // Clean, minimal lists of key event themes
  const words = [
    "HACKATHONS", "AI HACKS", "WORKSHOPS",
    "COMPETITIONS", "DESIGN SPRINT", "SEMINARS",
    "ROBOTICS", "WEB3", "TECH DEV", "IDEATION"
  ];

  return (
    <div className={`h-screen w-full bg-[#fdfaf2] flex flex-col items-center justify-center overflow-hidden font-sans relative transition-all duration-500 ease-in-out ${isExiting ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100'}`}>
      
      {/* Top Brand Logo during loading */}
      <div className="absolute top-16 flex flex-col items-center gap-1.5 z-10">
        <span className="text-[#8c3a21] font-black text-3xl tracking-[0.22em] uppercase">
          CampusPilot
        </span>
        <div className="h-0.5 w-12 bg-[#cc2929] rounded-full" />
      </div>

      {/* Subtle, beautiful minimalist grid background */}
      <div className="absolute inset-0 opacity-[0.15]" style={{
        backgroundImage: `linear-gradient(to right, #8c3a21 1px, transparent 1px), linear-gradient(to bottom, #8c3a21 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      {/* The Central Minimal Hole */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Slow, clean, elegant dashed ring */}
        <div className="absolute w-[240px] h-[240px] border border-dashed border-[#cc2929]/40 rounded-full animate-[spin_20s_linear_infinite]" />
        
        {/* The 3D paper-cut style hole */}
        <div className="w-[160px] h-[160px] bg-[#ebdbb5] rounded-full border-2 border-[#cc2929] flex items-center justify-center relative overflow-hidden shadow-[inset_0_8px_16px_rgba(140,58,33,0.3)]">
          {/* Inner dark center representing the "depth" of the hole */}
          <div className="w-[80px] h-[80px] bg-[#8c3a21] rounded-full opacity-20 filter blur-md absolute" />
          
          {/* Centered clean AI text label */}
          <span className="text-[#8c3a21] font-black text-xs tracking-[0.25em] z-10 animate-pulse">
            LOADING
          </span>
        </div>
      </div>

      {/* Clean typographic elements falling into the hole */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {words.map((word, i) => {
          // Circular distribution
          const angle = (i / words.length) * Math.PI * 2;
          const startDistance = 320; // Start at a standard readable distance
          const startX = Math.cos(angle) * startDistance;
          const startY = Math.sin(angle) * startDistance;

          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#cc2929] font-bold text-sm tracking-[0.15em] whitespace-nowrap opacity-0 select-none"
              style={{
                animation: `minimalSink 1.8s cubic-bezier(0.25, 1, 0.5, 1) infinite`,
                animationDelay: `${i * 0.14}s`,
                '--startX': `${startX}px`,
                '--startY': `${startY}px`,
              } as React.CSSProperties}
            >
              {word}
            </div>
          );
        })}
      </div>

      {/* Mini loading status indicator */}
      <div className="absolute bottom-16 flex flex-col items-center gap-2 z-10">
        <span className="text-[#8c3a21]/60 font-bold text-[9px] uppercase tracking-[0.3em]">
          Accessing Event Vault
        </span>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-[#cc2929] rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-[#cc2929] rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-[#cc2929] rounded-full animate-bounce" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes minimalSink {
          0% {
            transform: translate3d(var(--startX), var(--startY), 0) scale(1.1);
            opacity: 0;
          }
          /* 1. Snap In quickly (The Hook) */
          15% {
            transform: translate3d(calc(var(--startX) * 0.42), calc(var(--startY) * 0.42), 0) scale(1.0);
            opacity: 1;
          }
          /* 2. Linger while keeping readability */
          65% {
            transform: translate3d(calc(var(--startX) * 0.35), calc(var(--startY) * 0.35), 0) scale(0.95);
            opacity: 1;
          }
          /* 3. Swift drop into center hole */
          100% {
            transform: translate3d(0px, 0px, 0) scale(0.2);
            opacity: 0;
            filter: blur(1.5px);
          }
        }
      `}} />
    </div>
  );
};
