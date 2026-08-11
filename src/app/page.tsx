import Hero from "@/components/Hero";
import TrustBanner from "@/components/TrustBanner";
import ServiceGrid from "@/components/ServiceGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowItWorks from "@/components/HowItWorks";
import AboutSection from "@/components/AboutSection";
import ServiceDetailPreview from "@/components/ServiceDetailPreview";
import ResourcesSection from "@/components/ResourcesSection";
import FAQAccordion from "@/components/FAQAccordion";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBanner />
      <ServiceGrid />
      <WhyChooseUs />
      <HowItWorks />
      <AboutSection />
      <ServiceDetailPreview />
      <ResourcesSection />
      <FAQAccordion />
      <FinalCTA />
    </>
  );
}
