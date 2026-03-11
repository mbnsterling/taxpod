"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { processSteps } from "~/config/marketing";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
};

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const stepVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export function ProcessSection() {
  const ref = useRef(null);
  const headerRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const headerInView = useInView(headerRef, {
    once: true,
    margin: "-80px 0px",
  });

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="mb-12 flex flex-col items-center gap-2 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease }}
        >
          <span className="text-accent text-[11px] font-semibold tracking-[0.12em] uppercase">
            PROCESS
          </span>
          <h2 className="max-w-lg text-3xl leading-[1.15] font-bold tracking-tight text-gray-900 md:text-4xl lg:text-[40px]">
            Tax filing in 3 simple steps
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-gray-600">
            No accountant needed. No jargon. Just a clear path from setup to
            submission.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12"
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {processSteps.map((step) => (
            <motion.div
              key={step.number}
              variants={stepVariant}
              className="flex flex-col gap-3"
            >
              <span className="text-accent text-5xl leading-none font-extrabold opacity-25 md:text-6xl">
                {step.number}
              </span>
              <h3 className="text-base font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
