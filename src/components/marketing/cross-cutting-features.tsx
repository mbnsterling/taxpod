"use client";

import { Shield, Bell, FileDown, Clock, Users, Calculator } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { StaggerGrid } from "~/components/ui/stagger-grid";
import { crossCuttingFeatures } from "~/config/marketing";

type IconColor = "blue" | "orange" | "pink" | "purple" | "green";

const iconColorMap: Record<IconColor, string> = {
  blue:   "bg-blue-50 text-blue-500",
  orange: "bg-orange-50 text-orange-500",
  pink:   "bg-pink-50 text-pink-500",
  purple: "bg-violet-50 text-violet-500",
  green:  "bg-green-50 text-green-500",
};

const iconMap: Record<string, React.ReactNode> = {
  compliance: <Calculator className="h-5 w-5" />,
  security:   <Shield className="h-5 w-5" />,
  reminders:  <Bell className="h-5 w-5" />,
  reports:    <FileDown className="h-5 w-5" />,
  history:    <Clock className="h-5 w-5" />,
  support:    <Users className="h-5 w-5" />,
};

export function CrossCuttingFeaturesSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="mb-12 flex flex-col items-center gap-2 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
            PLATFORM
          </span>
          <h2 className="max-w-lg text-3xl font-bold leading-[1.15] tracking-tight text-gray-900 md:text-4xl lg:text-[40px]">
            Built on a foundation you can trust
          </h2>
          <p className="max-w-[480px] text-[15px] leading-relaxed text-gray-600">
            Every TaxPod plan includes these platform-wide capabilities — no upsells, no surprises.
          </p>
        </ScrollReveal>

        {/* Grid */}
        <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {crossCuttingFeatures.map((feat) => (
            <Card
              key={feat.id}
              className="cursor-default rounded-card border border-gray-200/60 bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <CardContent className="p-6">
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-icon ${iconColorMap[feat.iconColor as IconColor]}`}
                >
                  {iconMap[feat.id]}
                </div>
                <h3 className="mb-2 text-base font-semibold leading-snug text-gray-900">
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">{feat.description}</p>
              </CardContent>
            </Card>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
