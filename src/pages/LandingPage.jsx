import React from "react";
import HeroSection from "../components/landing/heroSection";
import { PricingSection } from "../components/landing/pricing";
import { WhyChooseUs } from "../components/landing/whyChooseUs";
import Footer from "../components/ui/footer";
import Header from "../components/ui/header";

import Silk from "../components/Silk";
import ClickSpark from "../components/ClickSpark";
import CurvedLoop from "../components/CurvedLoop";
import { LANDING_THEME } from "../constants/theme-landing";

const LandingPage = () => {
  return (
    <div
      className={`relative min-h-screen ${LANDING_THEME.colors.background.main} ${LANDING_THEME.typography.family.main} ${LANDING_THEME.colors.text.heading} overflow-hidden`}
    >
      {/* ClickSpark wrapper: Set to white (#ffffff) */}
      <ClickSpark
        sparkColor="#ffffff"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={10}
        duration={500}
      >
        {/* Silk Background Layer 
            Using a light slate color (#cbd5e1) provides the necessary contrast 
            for white sparks to be visible while keeping the page looking bright and minimal. */}
        <div className="absolute inset-0 pointer-events-none opacity-90">
          <Silk
            speed={3}
            scale={1.2}
            color="#1639E3"
            noiseIntensity={1.2}
            rotation={0}
          />
        </div>

        {/* Main Content Layer */}
        <div className="relative flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <HeroSection />

            {/* Non-interactive Curved Loop with slower speed */}
            <div className="relative w-full py-10 -mt-140 -mb-40">
              <CurvedLoop
                marqueeText="Be ✦ Creative ✦ With ✦ React ✦ Bits ✦"
                speed={2}
                curveAmount={400}
                interactive={false}
                className={"text-4xl"}
              />
            </div>

            <WhyChooseUs />
            <PricingSection />
          </main>
          <Footer />
        </div>
      </ClickSpark>
    </div>
  );
};

export default LandingPage;
