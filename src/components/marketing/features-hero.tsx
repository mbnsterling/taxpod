"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { featuresHero } from "~/config/marketing";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease, delay } },
});

const widgetVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease, delay: 0.25 },
  },
};

export function FeaturesHero() {
  return (
    <section className="bg-brand-bg py-16 md:py-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          {/* Left column – text + CTAs */}
          <div className="flex flex-col gap-5">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.6 },
                },
              }}
            >
              <Badge className="border-accent/20 bg-brand-badge-bg text-brand-badge-text w-fit rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.04em] uppercase">
                {featuresHero.badge}
              </Badge>
            </motion.div>

            <div>
              <motion.h1
                className="text-5xl leading-[1.1] font-extrabold tracking-tight text-gray-900 md:text-6xl"
                initial="hidden"
                animate="visible"
                variants={fadeUp(0.1)}
              >
                {featuresHero.headline}
              </motion.h1>
              <motion.span
                className="text-accent block text-5xl leading-[1.1] font-extrabold tracking-tight italic md:text-6xl"
                initial="hidden"
                animate="visible"
                variants={fadeUp(0.2)}
              >
                {featuresHero.headlineAccent}
              </motion.span>
            </div>

            <motion.p
              className="max-w-xl text-base leading-relaxed text-gray-600"
              initial="hidden"
              animate="visible"
              variants={fadeUp(0.3)}
              dangerouslySetInnerHTML={{ __html: featuresHero.subtext }}
            />

            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial="hidden"
              animate="visible"
              variants={fadeUp(0.4)}
            >
              <motion.div
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  render={<Link href={featuresHero.primaryCta.href} />}
                  className="bg-primary shadow-btn-primary hover:bg-primary-dark hover:shadow-btn-primary-hover rounded-[10px] px-6 py-3 text-sm font-semibold text-white transition-all duration-200"
                >
                  {featuresHero.primaryCta.label}
                </Button>
              </motion.div>

              {/* Anchor links to persona sections */}
              <div className="flex flex-wrap items-center gap-2">
                {featuresHero.anchorLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="hover:border-primary hover:text-primary rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 transition-all duration-150"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right column – glass widget card */}
          <motion.div
            className="hidden lg:block"
            initial="hidden"
            animate="visible"
            variants={widgetVariant}
          >
            <Card className="rounded-card shadow-card border border-white/60 bg-white/60 backdrop-blur-xl">
              <div className="flex flex-col gap-6 p-6">
                <div>
                  <p className="text-accent text-[11px] font-semibold tracking-[0.12em] uppercase">
                    Coverage at a glance
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    See how TaxPod adapts to every Nigerian tax profile.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <div className="rounded-xl border border-emerald-50 bg-white/60 px-4 py-3 shadow-sm">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-emerald-600 uppercase">
                      Employees
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      Payslip-based PIT in minutes
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Upload or enter salary, we handle the 2025 bands for you.
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-50 bg-white/60 px-4 py-3 shadow-sm">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-emerald-600 uppercase">
                      Founders
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      Payroll + director taxes
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Handle staff PAYE, your own PIT, and levy in one place.
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-50 bg-white/60 px-4 py-3 shadow-sm md:col-span-2">
                    <p className="text-[11px] font-semibold tracking-[0.12em] text-emerald-600 uppercase">
                      Accountants
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      Multi-client workspace
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Switch between clients, track filing status, and export
                      compliant reports.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
