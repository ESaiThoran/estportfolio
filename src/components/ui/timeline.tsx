"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
  useSpring,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"], // FIXED: More generous scroll range
  });

  // FIXED: Much smoother spring animation
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 400,   // INCREASED from 100 - much more responsive
    damping: 40,      // INCREASED from 30 - less oscillation
    restDelta: 0.01   // INCREASED from 0.001 - less precision for smoother feel
  });

  const heightTransform = useTransform(smoothScrollProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(smoothScrollProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-transparent font-sans md:px-10"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            {/* FIXED: Simplified sticky positioning - no complex calculations */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center self-start max-w-xs lg:max-w-sm md:w-full top-10"> 
              {/* FIXED: Simplified dot positioning */}
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/50 z-50 border-2 border-gray-300">
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 border border-white shadow-inner" />
              </div>
              <motion.h3 
                className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold text-white bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }} // FIXED: Faster, less delay
                viewport={{ once: true }}
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                {item.title}
              </motion.h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-white" style={{ fontFamily: "'Nunito', sans-serif" }}>
                {item.title}
              </h3>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }} // FIXED: Faster, less delay
                viewport={{ once: true }}
              >
                {item.content}
              </motion.div>
            </div>
          </div>
        ))}
        
        {/* FIXED: Simplified timeline line */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-visible w-[4px]"
        >
          {/* Static base line */}
          <div className="absolute inset-x-0 top-0 w-[4px] bg-black border border-gray-600 shadow-lg shadow-black/60" 
               style={{ height: height + "px" }} />
          
          {/* FIXED: Smoother animated progress line */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[4px] bg-white shadow-lg shadow-white/40 border border-gray-200"
          />
          
          {/* FIXED: Smoother moving dot */}
          <motion.div
            style={{
              y: heightTransform,
            }}
            className="absolute left-[-6px] w-[16px] h-[16px] z-50"
          >
            <div className="absolute inset-0 rounded-full bg-white shadow-lg shadow-white/60 border-2 border-gray-200">
              <div className="absolute inset-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};