import { MarketingLayout } from "~/components/marketing/layout";
import { HeroSection } from "~/components/marketing/hero-section";
import { StatsBar } from "~/components/marketing/stats-bar";
import { HomepageFeaturesSection } from "~/components/marketing/homepage-features";
import { ProcessSection } from "~/components/marketing/process-section";
import { TestimonialsSection } from "~/components/marketing/testimonials-section";
import { CTABanner } from "~/components/marketing/cta-banner";

export default function Home() {
  return (
    <MarketingLayout>
      <HeroSection />
      <StatsBar />
      <HomepageFeaturesSection />
      <ProcessSection />
      <TestimonialsSection />
      <CTABanner />
    </MarketingLayout>
  );
}
