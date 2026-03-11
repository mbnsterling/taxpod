"use client";

import Link from "next/link";
import { ArrowRight, Calculator, FileText, Bell, FileDown } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { StaggerGrid } from "~/components/ui/stagger-grid";
import { homepageFeatures, enterpriseCard } from "~/config/marketing";

type IconColor = "blue" | "orange" | "pink" | "purple" | "green";

const iconColorMap: Record<IconColor, string> = {
  blue: "bg-blue-50 text-blue-500",
  orange: "bg-orange-50 text-orange-500",
  pink: "bg-pink-50 text-pink-500",
  purple: "bg-violet-50 text-violet-500",
  green: "bg-green-50 text-green-500",
};

const iconMap: Record<string, React.ReactNode> = {
  calculator: <Calculator className="h-5 w-5" />,
  wizard: <FileText className="h-5 w-5" />,
  reminders: <Bell className="h-5 w-5" />,
  reports: <FileDown className="h-5 w-5" />,
};

export function HomepageFeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <ScrollReveal className="mb-12 flex flex-col items-center gap-2 text-center">
          <span className="text-accent text-[11px] font-semibold tracking-[0.12em] uppercase">
            CAPABILITIES
          </span>
          <h2 className="max-w-3xl text-3xl leading-[1.15] font-bold tracking-tight text-gray-900 md:text-4xl lg:text-[40px]">
            Everything you need to stay compliant
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-gray-600">
            Built for the modern Nigerian economy. Simple for small shops,
            powerful for tech startups.
          </p>
        </ScrollReveal>

        {/* Top 3-column grid */}
        <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {homepageFeatures.slice(0, 3).map((feature) => (
            <Card
              key={feature.id}
              className="rounded-card hover:shadow-card-hover cursor-default bg-white shadow-[#F8FAFC] transition-all duration-200 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div
                  className={`rounded-icon mb-4 flex h-10 w-10 items-center justify-center ${iconColorMap[feature.iconColor]}`}
                >
                  {iconMap[feature.id]}
                </div>
                <h3 className="mb-2 text-base leading-snug font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {feature.description}
                </p>
                <Link
                  href={feature.link}
                  className="text-primary hover:text-primary-mid mt-3 inline-flex items-center gap-1 text-[13px] font-semibold transition-colors"
                >
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </StaggerGrid>

        {/* Bottom row: 4th feature + enterprise dark card */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-[1fr_2fr]">
          {/* 4th feature card */}
          <ScrollReveal delay={0.05}>
            <Card className="rounded-card hover:shadow-card-hover h-full cursor-default bg-white shadow-[#F8FAFC] transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-6">
                <div
                  className={`rounded-icon mb-4 flex h-10 w-10 items-center justify-center ${iconColorMap[homepageFeatures[3]!.iconColor]}`}
                >
                  {iconMap[homepageFeatures[3]!.id]}
                </div>
                <h3 className="mb-2 text-base leading-snug font-semibold text-gray-900">
                  {homepageFeatures[3]!.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {homepageFeatures[3]!.description}
                </p>
                <Link
                  href={homepageFeatures[3]!.link}
                  className="text-primary hover:text-primary-mid mt-3 inline-flex items-center gap-1 text-[13px] font-semibold transition-colors"
                >
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Enterprise dark card */}
          <ScrollReveal delay={0.15}>
            <Card className="rounded-card bg-primary-dark h-full text-white">
              <CardContent className="flex h-full flex-col gap-4 p-8">
                <span className="text-primary-light text-[11px] font-semibold tracking-[0.12em] uppercase">
                  {enterpriseCard.eyebrow}
                </span>
                <h3 className="text-2xl leading-snug font-bold text-white md:text-3xl">
                  {enterpriseCard.headline}
                </h3>
                <p className="max-w-sm text-sm leading-relaxed text-white/70">
                  {enterpriseCard.description}
                </p>
                <div className="mt-auto">
                  <Button
                    render={<Link href={enterpriseCard.cta.href} />}
                    variant="outline"
                    className="rounded-[10px] border-white/50 bg-transparent text-white hover:bg-white/10"
                  >
                    {enterpriseCard.cta.label}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
