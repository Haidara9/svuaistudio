import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import HowItWorks from "@/components/how-it-works";
import PricingSection from "@/components/pricing-section";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" dir="rtl">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <Testimonials />
      <Footer />
      
      {/* Scroll to Top Button */}
      <button
        id="scrollTop"
        className="fixed bottom-8 left-8 w-12 h-12 bg-gradient-to-r from-secondary to-accent text-background rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 invisible"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        data-testid="button-scroll-top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </div>
  );
}
