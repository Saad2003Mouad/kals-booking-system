"use client";

import { useEffect, useReducer } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "bl_intro_shown";

/**
 * PremiumEntry – first-visit splash animation.
 *
 * • Plays once per browser session (sessionStorage flag).
 * • Respects prefers-reduced-motion: skips the animation if the user
 *   has opted out, avoiding any layout shift for those users.
 * • GPU-accelerated transforms only (opacity + scale/y) → no CLS.
 * • Removed from DOM after completion so it cannot affect layout.
 */
export default function PremiumEntry() {
  const [visible, dismiss] = useReducer(() => false, true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Already shown this session → skip immediately without rendering
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) {
      dismiss();
      return;
    }

    // If reduced-motion → skip immediately, mark as shown
    if (shouldReduceMotion) {
      sessionStorage.setItem(SESSION_KEY, "1");
      dismiss();
      return;
    }

    // Mark shown and auto-dismiss after 2s
    sessionStorage.setItem(SESSION_KEY, "1");
    const timer = setTimeout(() => dismiss(), 2000);
    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="premium-entry"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#000223",
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif"
              alt="Boston Legend Ice Cream Truck"
              width={200}
              height={76}
              style={{ display: "block", filter: "brightness(0) invert(1)" }}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.55 }}
            style={{
              marginTop: 20,
              color: "#FFA000",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Greater Boston's Finest Ice Cream Experience
          </motion.p>

          {/* Thin gold progress bar */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: 3,
              background: "#FFA000",
              transformOrigin: "left center",
            }}
            initial={{ scaleX: 0, width: "100%" }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
