"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { ScrollReveal } from "~/components/ui/scroll-reveal";
import { StaggerGrid } from "~/components/ui/stagger-grid";
import { testimonials } from "~/config/marketing";

export function TestimonialsSection() {
  return (
    <section
      className="bg-[#F8FAFC] py-16 md:py-24"
      aria-label="Customer testimonials"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <ScrollReveal className="flex flex-col gap-2">
            <span className="text-accent text-[11px] font-semibold tracking-[0.12em] uppercase">
              SOCIAL PROOF
            </span>
            <h2 className="text-3xl leading-[1.15] font-bold tracking-tight text-gray-900 md:text-4xl">
              Built by Nigerians,
              <br />
              trusted by Nigerians.
            </h2>
          </ScrollReveal>
        </div>

        {/* Cards */}
        <StaggerGrid className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.id}
              className="rounded-card hover:shadow-card-hover cursor-default bg-white shadow-[#F8FAFC] transition-all duration-200 hover:-translate-y-1"
            >
              <CardContent className="flex flex-col gap-4 p-6">
                {/* Stars */}
                <div
                  className="flex items-center gap-0.5"
                  aria-label={`${t.rating} out of 5 stars`}
                >
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="fill-accent text-accent h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm leading-[1.7] text-gray-600">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-auto flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary-light text-xs font-semibold text-white">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {t.role}, {t.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
