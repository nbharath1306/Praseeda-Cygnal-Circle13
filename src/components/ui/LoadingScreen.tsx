"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Loading materialization screen.
 * Circle13 logo materializes from glass, then the page fades in.
 * Shows for ~1.2s on first load.
 */
export function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
          {/* Logo materializes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: "brightness(2) blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "brightness(1) blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center gap-3"
          >
            {/* Glass diamond icon */}
            <div className="w-[48px] h-[48px] rounded-[14px] rotate-45 flex items-center justify-center border border-white/20"
              style={{
                background: "rgba(255,255,255,0.06)",
                boxShadow: "inset 0 0 16px -4px rgba(255,255,255,0.4), 0 4px 20px rgba(0,0,0,0.3)"
              }}
            >
              <span className="text-white/80 text-[18px] font-bold -rotate-45">C</span>
            </div>
            {/* Text */}
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="text-[11px] text-white/30 tracking-[0.3em] uppercase font-medium"
            >
              Circle13
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
