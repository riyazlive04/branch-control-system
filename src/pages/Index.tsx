import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import PatientDropOffSection from "@/components/PatientDropOffSection";
import ExpansionPainSection from "@/components/ExpansionPainSection";
import SolutionSection from "@/components/SolutionSection";
import SystemModules from "@/components/SystemModules";
import DashboardDemo from "@/components/DashboardDemo";
import BenefitsSection from "@/components/BenefitsSection";
import BlueprintSection from "@/components/BlueprintSection";
import AuthoritySection from "@/components/AuthoritySection";
import ROISection from "@/components/ROISection";
import TimelineSection from "@/components/TimelineSection";
import BookingCalendar from "@/components/BookingCalendar";
import GuaranteeCard from "@/components/GuaranteeCard";
import FinalCTA from "@/components/FinalCTA";
import StickyCTA from "@/components/StickyCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <PatientDropOffSection />
      <ExpansionPainSection />
      <SolutionSection />
      <SystemModules />
      <DashboardDemo />
      <BenefitsSection />
      <BlueprintSection />
      <AuthoritySection />
      <ROISection />
      <TimelineSection />
      <BookingCalendar />
      <GuaranteeCard />
      <FinalCTA />
      <Footer />
      <StickyCTA />
    </div>
  );
};

export default Index;
