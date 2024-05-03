import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/landingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page bg-base-100">
      {/* Header */}
      <header className="header bg-transparent py-4 px-8">
        <nav className="container max-w-5xl flex items-center justify-between mx-auto">
          <div className="flex lg:flex-1">
            <a className="flex items-center gap-2 shrink-0" href="/">
              <img src="/logo.png" alt="Logo" className="w-6 md:w-7" />
              <span className="font-extrabold text-lg">JobTrackr</span>
            </a>
          </div>
          <div className="hidden lg:flex lg:justify-end lg:flex-1">
            <button className="btn btn-sm" onClick={() => navigate('/login')}>Login</button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section md:min-h-[100vh] bg-base-100 relative overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center gap-16 lg:gap-20 px-8 py-12 lg:py-32">
          <div className="relative flex flex-col gap-10 lg:gap-12 items-center justify-center text-center">
            <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight">Focus on your job search, not the tracking</h1>
            <p className="text-lg text-base-content-secondary leading-relaxed max-w-md mx-auto">Let JobTrackr automatically track your job applications from Indeed and LinkedIn, so you can focus on landing your dream job.</p>
            <button className="btn btn-primary btn-block group !btn-wide" onClick={() => navigate('/signup')}>
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] fill-white/10 group-hover:translate-x-0.5 group-hover:fill-white/20 transition-transform duration-200">
                <path d="m3 3 3 9-3 9 19-9Z"></path>
                <path d="M6 12h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features-section py-24 md:py-32 space-y-24 md:space-y-32 max-w-5xl mx-auto bg-base-100">
        <div className="px-8">
          <h2 className="font-extrabold text-4xl lg:text-5xl tracking-tight mb-12 md:mb-24">Automated job application tracking</h2>
          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            <div className="grid grid-cols-1 items-stretch gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-24">
              <ul className="w-full">
                <li className="border-b">
                  <div className="relative flex gap-2 items-center w-full py-4 text-base font-medium text-left md:text-lg">
                    <span className="duration-100 text-primary">1.</span>
                    <span className="flex-1 text-base-content text-primary font-semibold">Connect LinkedIn and Indeed accounts</span>
                  </div>
                  <div className="pb-8 text-base-content-secondary">
                    <p>Add your LinkedIn and Indeed accounts to JobTrackr. It takes less than a minute. No coding required.</p>
                  </div>
                </li>
                <li className="border-b">
                  <div className="relative flex gap-2 items-center w-full py-4 text-base font-medium text-left md:text-lg">
                    <span className="duration-100">2.</span>
                    <span className="flex-1 text-base-content">Automatically track applications</span>
                  </div>
                  <div className="pb-8 text-base-content-secondary">
                    <p>JobTrackr will automatically track your job applications from LinkedIn and Indeed, keeping all the details in one place.</p>
                  </div>
                </li>
                <li>
                  <div className="relative flex gap-2 items-center w-full py-4 text-base font-medium text-left md:text-lg">
                    <span className="duration-100">3.</span> 
                    <span className="flex-1 text-base-content">Stay organized and focused</span>
                  </div>
                  <div className="pb-8 text-base-content-secondary">
                    <p>With all your job applications in one place, you can easily stay organized and focused on your job search. Get reminders for follow-ups and interviews.</p>
                  </div>
                </li>
              </ul>
              <div>
                <img src="/dashboard.png" alt="JobTrackr Dashboard" className="rounded-xl w-full sm:w-[26rem] sm:-m-2 sm:p-2 border bg-base-200 object-contain object-center" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section bg-base-200 overflow-hidden" id="pricing">
        <div className="py-24 px-8 max-w-5xl mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="max-w-xl font-bold text-3xl lg:text-5xl tracking-tight mb-8 mx-auto">Simple, transparent pricing</h2>
            <div className="text-base-content-secondary max-w-md mx-auto">Get full access to JobTrackr with a single payment.</div>
          </div>
          <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch">
            <div className="relative w-full max-w-lg">
              <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  <p className="text-5xl tracking-tight font-extrabold">$29</p>
                  <div className="flex flex-col justify-end mb-[4px]">
                    <p className="text-xs text-base-content/60 uppercase font-semibold">One-time payment</p>
                  </div>
                </div>
                <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] opacity-80 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Unlimited job applications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] opacity-80 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Automated tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] opacity-80 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Application insights &amp; analytics</span>
                  </li>
                </ul>
                <div className="space-y-2">
                  <button className="btn btn-primary btn-block group" onClick={() => navigate('/signup')}>
                    Get Started
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] fill-white/10 group-hover:translate-x-0.5 group-hover:fill-white/20 transition-transform duration-200">
                      <path d="m3 3 3 9-3 9 19-9Z"></path>
                      <path d="M6 12h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer bg-base-300/50 border-t border-base-content/10">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="text-center">
            <p>&copy; 2024 JobTrackr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;