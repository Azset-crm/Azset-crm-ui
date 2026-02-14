import ResponsiveHeroBanner from "@/components/ui/responsive-hero-banner";
import { FeaturesSection, StatsSection, CtaSection } from "@/components/home-sections";

export default function Home() {
  return (
    <div className="bg-background text-foreground">
      <ResponsiveHeroBanner />
      <StatsSection />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
}
