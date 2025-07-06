"use client";
import React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

// Make sure you have framer-motion installed:
// npm install framer-motion

export const LampContainer = ({ 
  children, 
  className,
  triggerOnce = true // Allow re-triggering
}: { 
  children: React.ReactNode; 
  className?: string;
  triggerOnce?: boolean;
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { 
    once: triggerOnce, 
    margin: "-10% 0px -10% 0px" // Trigger when 10% visible
  });

  return (
    <div 
      ref={ref}
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 w-full z-0",
        className
      )}
    >
      {/* Lamp Background Elements */}
      <div className="absolute inset-0 flex items-start justify-center pt-0">
        <div className="relative w-full h-full">
          {/* Left Lamp Beam */}
          <motion.div
            initial={{ opacity: 0.3, width: "8rem" }}
            animate={isInView ? { 
              opacity: 1, 
              width: "30rem" 
            } : { 
              opacity: 0.3, 
              width: "8rem" 
            }}
            transition={{ 
              delay: 0, 
              duration: 0.4, 
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute right-1/2 h-56 overflow-visible bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top] top-0"
          >
            <div className="absolute w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            <div className="absolute w-40 h-[100%] left-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
          </motion.div>

          {/* Right Lamp Beam */}
          <motion.div
            initial={{ opacity: 0.3, width: "8rem" }}
            animate={isInView ? { 
              opacity: 1, 
              width: "30rem" 
            } : { 
              opacity: 0.3, 
              width: "8rem" 
            }}
            transition={{ 
              delay: 0, 
              duration: 0.4, 
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute left-1/2 h-56 bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top] top-0"
          >
            <div className="absolute w-40 h-[100%] right-0 bg-slate-950 bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
            <div className="absolute w-[100%] right-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          </motion.div>

          {/* Central Glow Effects */}
          <motion.div 
            initial={{ opacity: 0.1, scale: 0.5 }}
            animate={isInView ? { 
              opacity: 0.3, 
              scale: 1 
            } : { 
              opacity: 0.1, 
              scale: 0.5 
            }}
            transition={{ 
              delay: 0, 
              duration: 0.4, 
              ease: "easeInOut" 
            }}
            className="absolute top-32 left-1/2 transform -translate-x-1/2 z-30 h-36 w-[28rem] rounded-full bg-cyan-500 blur-3xl"
          />
          
          <motion.div
            initial={{ width: "4rem", opacity: 0.2 }}
            animate={isInView ? { 
              width: "16rem", 
              opacity: 0.4 
            } : { 
              width: "4rem", 
              opacity: 0.2 
            }}
            transition={{ 
              delay: 0, 
              duration: 0.4, 
              ease: "easeInOut",
            }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 z-30 h-36 rounded-full bg-cyan-400 blur-2xl"
          />

          {/* Bottom fade effect */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-40" />
        </div>
      </div>

      {/* Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { 
          opacity: 1, 
          y: 0 
        } : { 
          opacity: 0, 
          y: 20 
        }}
        transition={{ 
          delay: 0.4, 
          duration: 0.4, 
          ease: "easeOut" 
        }}
        className="relative z-50 flex flex-col items-center justify-center w-full h-full px-5"
      >
        <div className="max-w-6xl mx-auto text-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
};