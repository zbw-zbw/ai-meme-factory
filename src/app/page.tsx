import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import DemoSection from "@/components/DemoSection";
import FeaturesSection from "@/components/FeaturesSection";
import StepsSection from "@/components/StepsSection";
import InspirationSection from "@/components/InspirationSection";
import CTAFooterSection from "@/components/CTAFooterSection";
import TestimonialSection from "@/components/TestimonialSection";
import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <div className="bg-white/50">
          <StatsSection />
        </div>
        <FeaturesSection />
        <div className="bg-white/50">
          <StepsSection />
        </div>
        <DemoSection />
        <div className="bg-white/50">
          <InspirationSection />
        </div>
        <TestimonialSection />
        <div className="bg-white/50">
          <FAQSection />
        </div>
        <CTAFooterSection />
      </main>
    </>
  );
}
