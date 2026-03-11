"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { statsItems } from "~/config/marketing";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section className="py-6" aria-label="Key statistics">
      <motion.div
        ref={ref}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 sm:px-6 md:grid-cols-4 lg:px-8"
        variants={container}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {statsItems.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="flex flex-col items-center justify-center gap-1 rounded-md border border-slate-100 bg-white px-4 py-10 shadow-2xl shadow-emerald-100"
          >
            <span className="text-2xl font-extrabold tracking-tight text-emerald-600 md:text-3xl">
              {stat.value}
            </span>
            <span className="text-center text-[11px] font-medium tracking-[0.06em] text-gray-400 uppercase">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
