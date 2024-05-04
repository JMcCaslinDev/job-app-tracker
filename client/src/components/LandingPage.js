import React from 'react';
import { useNavigate } from 'react-router-dom';
import ComparisonSection from './ComparisonSection';
import FeaturesSection from './FeaturesSection';
import VideoDemoSection from './VideoDemoSection';
import FAQSection from './FAQSection';
import Footer from './Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page bg-base-100">
      {/* Header */}
      <header className="header bg-transparent py-4 px-8">
        <nav className="container max-w-5xl flex items-center justify-between mx-auto">
          <div className="flex lg:flex-1">
            <a className="flex items-center gap-2 shrink-0" href="/">
              <img src="./logo.svg" alt="Logo" className="w-6 md:w-7" />
              <span className="font-extrabold text-lg">JobTrackr</span>
            </a>
          </div>
          <div className="hidden lg:flex lg:justify-end lg:flex-1">
          <button className="btn btn-sm bg-[rgb(166,173,187)] text-gray-800 hover:bg-[rgb(146,153,167)] flex items-center justify-center h-full" onClick={() => navigate('/login')}>Login</button>

          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section md:min-h-[90vh] bg-base-100 relative overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center gap-16 lg:gap-20 px-8 py-16 lg:py-24">
          <div className="relative flex flex-col gap-12 lg:gap-16 items-center justify-center text-center">
            <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight">Focus on your job search, not the tracking</h1>
            <p className="text-lg text-base-content-secondary leading-relaxed max-w-md mx-auto">Let JobTrackr track your job applications from Indeed and LinkedIn, so you can focus on landing your dream job.</p>
            <button className="btn btn-primary btn-block group !btn-wide" onClick={() => navigate('/signup')}>
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 w-[18px] h-[18px] fill-white/10 group-hover:translate-x-1 group-hover:fill-white/20 transition-transform duration-200">
                <path d="m3 3 3 9-3 9 19-9Z"></path>
                <path d="M6 12h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <ComparisonSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Video Demo Section */}
      <VideoDemoSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;