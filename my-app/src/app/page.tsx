import type { Metadata } from 'next';
import { 
  Navbar, 
  Hero, 
  HowItWorks, 
  Features, 
  Pricing, 
  Testimonials, 
  CTASection, 
  Footer 
} from '@/components/marketing';

export const metadata: Metadata = {
  title: 'SlideTheory - AI-Powered Slide Generation for Strategy Consultants',
  description: 'Transform your strategy briefs into McKinsey-quality presentations in minutes. Used by consultants at top firms to cut deck creation time by 90%.',
  keywords: ['AI slides', 'presentation generator', 'consulting', 'McKinsey', 'BCG', 'Bain', 'strategy consulting'],
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <CTASection />
      <Footer />
    </main>
  );
}
