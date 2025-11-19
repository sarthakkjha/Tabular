import Hero from './Hero';
import Features from './Features';
import CTA from './CTA';

function Landing() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Hero />
      <Features />
      <CTA />
    </div>
  );
}

export default Landing;