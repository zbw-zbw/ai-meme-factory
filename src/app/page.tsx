import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
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
        <div className="bg-white/50">
          <FeaturesSection />
        </div>
        <StepsSection />
        <div className="bg-white/50">
          <DemoSection />
        </div>
        <InspirationSection />
        <CTAFooterSection />
      </main>
    </>
  );
}
