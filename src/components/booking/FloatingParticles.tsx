"use client";
import { useEffect, useRef } from "react";

const PARTICLES = [
  { emoji: "🍦", size: 28, dur: 12, delay: 0,   startX: 8  },
  { emoji: "🍧", size: 22, dur: 16, delay: 2,   startX: 20 },
  { emoji: "🍨", size: 24, dur: 14, delay: 4,   startX: 35 },
  { emoji: "🎉", size: 20, dur: 18, delay: 1,   startX: 55 },
  { emoji: "🍦", size: 30, dur: 10, delay: 6,   startX: 70 },
  { emoji: "✨", size: 18, dur: 20, delay: 3,   startX: 82 },
  { emoji: "🍧", size: 26, dur: 13, delay: 8,   startX: 92 },
  { emoji: "🎈", size: 22, dur: 17, delay: 5,   startX: 48 },
  { emoji: "🍦", size: 20, dur: 15, delay: 9,   startX: 15 },
  { emoji: "⭐", size: 16, dur: 22, delay: 7,   startX: 65 },
];

export default function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute select-none"
          style={{
            left: `${p.startX}%`,
            bottom: "-60px",
            fontSize: `${p.size}px`,
            animation: `floatUp ${p.dur}s ease-in-out ${p.delay}s infinite`,
            opacity: 0,
          }}
        >
          {p.emoji}
        </div>
      ))}

      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg)   scale(0.8); opacity: 0; }
          10%  { opacity: 0.6; }
          50%  { transform: translateY(-50vh) rotate(20deg)  scale(1.1); opacity: 0.4; }
          90%  { opacity: 0.2; }
          100% { transform: translateY(-105vh) rotate(-10deg) scale(0.7); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
