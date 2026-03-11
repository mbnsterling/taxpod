import { type Metadata } from "next";
import { MarketingLayout } from "~/components/marketing/layout";
import { FeaturesHero } from "~/components/marketing/features-hero";
import { PersonaFeaturesSection } from "~/components/marketing/persona-features-section";
import { CrossCuttingFeaturesSection } from "~/components/marketing/cross-cutting-features";
import { CTABanner } from "~/components/marketing/cta-banner";

export const metadata: Metadata = {
  title: "Features - TaxPod Nigeria",
  description:
    "Explore TaxPod features built for employees, founders, and accountants. Fully compliant with the Nigeria Tax Act 2025.",
};

export default function FeaturesPage() {
  return (
    <MarketingLayout>
      <FeaturesHero />
      <PersonaFeaturesSection />
      <CrossCuttingFeaturesSection />
      <CTABanner />
    </MarketingLayout>
  );
}
