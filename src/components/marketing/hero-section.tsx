"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bolt, ShieldCheck } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { heroContent } from "~/config/marketing";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease, delay } },
});

const slideInRight = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease, delay: 0.3 },
  },
};

export function HeroSection() {
  return (
    <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Left column */}
        <div className="flex flex-col gap-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.6 } },
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-4 py-1.5 text-xs font-black tracking-widest text-emerald-700 uppercase shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {heroContent.badge}
            </div>
          </motion.div>

          <div className="flex flex-col gap-0">
            <motion.h1
              className="mb-2 text-5xl leading-[1.05] font-extrabold tracking-tight text-slate-900 md:text-7xl"
              initial="hidden"
              animate="visible"
              variants={fadeUp(0.1)}
            >
              File your Nigerian taxes
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent drop-shadow-sm">
                without the wahala
              </span>
            </motion.h1>
          </div>

          <motion.p
            className="mx-auto mb-4 max-w-3xl text-lg leading-relaxed font-medium text-slate-600 md:text-xl"
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.2)}
          >
            TaxPod guides you step-by-step through your tax return — whether
            you&apos;re a freelancer, shop owner, or running a registered
            company. No jargon. No stress.
          </motion.p>

          <motion.div
            className="mx-auto flex flex-col items-center gap-4 sm:flex-row"
            initial="hidden"
            animate="visible"
            variants={fadeUp(0.3)}
          >
            {/* Primary CTA */}
            <motion.div
              whileHover={{ y: -1, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="w-full sm:w-auto"
            >
              <Button
                render={<Link href={heroContent.primaryCta.href} />}
                className=""
              >
                Start Filing Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>

            {/* Secondary CTA – white pill card */}
            <Button
              render={<Link href={heroContent.secondaryCta.href} />}
              variant="secondary"
            >
              Watch Demo
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
