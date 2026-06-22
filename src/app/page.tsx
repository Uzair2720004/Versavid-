import Nav from '@/components/landing/Nav';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import TrustBar from '@/components/landing/TrustBar';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="relative bg-black min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Features />
        <TrustBar />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
