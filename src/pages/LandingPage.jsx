import React from "react";
import HeroSection from "../components/landing/heroSection";
import { PricingSection } from "../components/landing/pricing";
import { WhyChooseUs } from "../components/landing/whyChooseUs";
import Footer from "../components/ui/footer";
import Header from "../components/ui/header";

import ClickSpark from "../components/ClickSpark";
import { StarsBackground } from "../components/animate-ui/components/backgrounds/stars";
import { LANDING_THEME } from "../constants/theme-landing";

const LandingPage = () => {
  return (
    <div
      // Changed to a brighter dark blue gradient so it doesn't look purely black
      className={`relative min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 ${LANDING_THEME.typography.family.main} overflow-hidden`}
    >
      <ClickSpark
        sparkColor="#ffffff"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={10}
        duration={500}
      >
        {/* Background Layer Container */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Base Stars Background */}
          <StarsBackground speed={100} />
        </div>

        {/* Main Content Layer */}
        <div className="relative z-10 flex flex-col min-h-screen bg-transparent">
          <Header />
          <main className="flex-grow">
            <HeroSection />
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
