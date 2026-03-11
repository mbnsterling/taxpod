"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { personaGroups } from "~/config/marketing";

type IconColor = "blue" | "orange" | "pink" | "purple" | "green";

const iconColorMap: Record<IconColor, string> = {
  blue: "bg-blue-50 text-blue-500",
  orange: "bg-orange-50 text-orange-500",
  pink: "bg-pink-50 text-pink-500",
  purple: "bg-violet-50 text-violet-500",
  green: "bg-green-50 text-green-500",
};

const checkColorMap: Record<IconColor, string> = {
  blue: "text-blue-500",
  orange: "text-orange-500",
  pink: "text-pink-500",
  purple: "text-violet-500",
  green: "text-green-500",
};

const personaIcons: Record<string, React.ReactNode> = {
  employees: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  founders: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  accountants: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
};

interface PersonaCardProps {
  persona: (typeof personaGroups)[number];
  delay: number;
}

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

function PersonaCard({ persona, delay }: PersonaCardProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      id={persona.id}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.5, ease, delay }}
    >
      <Card className="rounded-card hover:shadow-card-hover h-full bg-white shadow-sm transition-all duration-200 hover:-translate-y-1">
        <CardContent className="flex h-full flex-col gap-5 p-6 md:p-8">
          {/* Icon + eyebrow */}
          <div className="flex items-center gap-3">
            <div
              className={`rounded-icon flex h-10 w-10 items-center justify-center ${iconColorMap[persona.iconColor]}`}
            >
              {personaIcons[persona.id]}
            </div>
            <span className="text-accent text-[11px] font-semibold tracking-[0.12em] uppercase">
              {persona.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-xl leading-snug font-bold tracking-tight text-gray-900 md:text-2xl">
            {persona.headline.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < persona.headline.split("\n").length - 1 && <br />}
              </span>
            ))}
          </h2>

          {/* Description */}
          <p className="text-sm leading-relaxed text-gray-600">
            {persona.description}
          </p>

          {/* Feature bullets */}
          <ul className="flex flex-col gap-2.5">
            {persona.features.map((feat) => (
              <li
                key={feat}
                className="flex items-start gap-2.5 text-sm text-gray-700"
              >
                <CheckCircle2
                  className={`mt-0.5 h-4 w-4 flex-shrink-0 ${checkColorMap[persona.iconColor]}`}
                  aria-hidden="true"
                />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-auto pt-2">
            <Button
              render={<Link href={persona.cta.href} />}
              className="w-full justify-between"
            >
              {persona.cta.label} <ArrowRight strokeWidth={3} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function PersonaFeaturesSection() {
  return (
    <section className="from-brand-bg bg-gradient-to-b to-white py-16 md:py-24">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-12 flex flex-col items-center gap-2 text-center">
          <span className="text-accent text-[11px] font-semibold tracking-[0.12em] uppercase">
            BY PERSONA
          </span>
          <h2 className="max-w-3xl text-3xl leading-[1.15] font-bold tracking-tight text-gray-900 md:text-4xl lg:text-[40px]">
            The right tools for your situation
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-gray-600">
            TaxPod adapts to who you are. Choose your profile and see
            what&rsquo;s built for you.
          </p>
        </ScrollReveal>

        {/* Persona cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {personaGroups.map((persona, index) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              delay={index * 0.12}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
