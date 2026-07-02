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
      <main>
        <HeroSection />
        <DemoSection />
        <FeaturesSection />
        <StepsSection />
        <InspirationSection />
        <CTAFooterSection />
      </main>
    </>
  );
}
