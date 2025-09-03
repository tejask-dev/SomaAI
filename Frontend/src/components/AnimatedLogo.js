import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedLogo({ isVisible, onAnimationComplete }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            scale: 0.1, 
            opacity: 0,
            x: "calc(50vw - 20px)", // Start from navbar position
            y: "calc(0vh + 20px)"
          }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            x: 0,
            y: 0
          }}
          exit={{ 
            scale: 0.1, 
            opacity: 0,
            x: "calc(50vw - 20px)",
            y: "calc(0vh + 20px)"
          }}
          transition={{ 
            duration: 1.2, 
            ease: "easeInOut",
            type: "spring",
            stiffness: 80,
            damping: 25
          }}
          onAnimationComplete={() => {
            // Add a small delay before hiding to make it more visible
            setTimeout(() => {
              onAnimationComplete();
            }, 500);
          }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.5, rotate: 0 }}
            animate={{ 
              scale: [0.5, 1.2, 1],
              rotate: [0, 360, 360]
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeInOut",
              times: [0, 0.7, 1]
            }}
            className="text-center pointer-events-auto"
          >
            <motion.div 
              className="h-32 w-32 rounded-3xl bg-white/20 backdrop-blur-sm grid place-items-center text-white font-black shadow-2xl border border-white/30"
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(255,255,255,0.4)",
                  "0 0 0 20px rgba(255,255,255,0)",
                  "0 0 0 0 rgba(255,255,255,0)"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <span className="text-6xl">S</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-4xl font-bold text-white mt-6 tracking-wider"
            >
              SomaAI
            </motion.h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
