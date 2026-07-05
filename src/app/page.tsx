import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import DemoSection from "@/components/DemoSection";
import FeaturesSection from "@/components/FeaturesSection";
import StepsSection from "@/components/StepsSection";
import InspirationSection from "@/components/InspirationSection";
import CTAFooterSection from "@/components/CTAFooterSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <StatsSection />
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="bg-white/50">
          <FeaturesSection />
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <StepsSection />
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="bg-white/50">
          <DemoSection />
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <InspirationSection />
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <CTAFooterSection />
      </main>
    </>
  );
}
