"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { ctaBanner } from "~/config/marketing";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease, delay } },
});

export function CTABanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section className="bg-brand-bg py-16 md:py-24">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="rounded-cta bg-primary-dark flex flex-col items-center gap-5 px-8 py-16 text-center md:py-20"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={
            inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }
          }
          transition={{ duration: 0.5, ease }}
        >
          <motion.h2
            className="max-w-xl text-3xl leading-[1.15] font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp(0.15)}
          >
            {ctaBanner.headline.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < ctaBanner.headline.split("\n").length - 1 && <br />}
              </span>
            ))}
          </motion.h2>

          <motion.p
            className="max-w-md text-base leading-relaxed text-white/70"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp(0.25)}
          >
            {ctaBanner.subtext}
          </motion.p>

          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp(0.35)}
            whileHover={{ y: -1, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              render={<Link href={ctaBanner.cta.href} />}
              className="text-primary-dark mt-2 rounded-[10px] bg-white px-8 py-3 font-semibold hover:bg-gray-100"
            >
              {ctaBanner.cta.label}
            </Button>
          </motion.div>

          <motion.div
            className="mt-1 flex items-center gap-5 text-xs font-medium text-white/50"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp(0.45)}
          >
            {ctaBanner.trustItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
