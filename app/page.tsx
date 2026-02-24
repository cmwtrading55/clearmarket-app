import Hero from "@/components/landing/Hero";
import StatsBar from "@/components/landing/StatsBar";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import StackSection from "@/components/landing/StackSection";
import NetworkParticipation from "@/components/landing/NetworkParticipation";
import CtaRibbon from "@/components/landing/CtaRibbon";
import StrategicFocus from "@/components/landing/StrategicFocus";
import MarketExpansion from "@/components/landing/MarketExpansion";
import EnterpriseReady from "@/components/landing/EnterpriseReady";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <StatsBar />
      <ProblemSection />
      <SolutionSection />
      <StackSection />
      <NetworkParticipation />
      <CtaRibbon
        heading="Become a Founding Member of ClearMarket"
        buttonText="Enquire Now"
      />
      <StrategicFocus />
      <MarketExpansion />
      <EnterpriseReady />
      <CtaRibbon
        heading="Be a part of the new oracle infrastructure, built on Solana"
        buttonText="Request Access"
      />
      <Footer />
    </main>
  );
}
