import React from 'react';
import { useNavigate } from 'react-router-dom';

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="pricing-section bg-base-100 overflow-hidden min-h-screen" id="pricing">
      <div className="py-24 px-8 max-w-5xl mx-auto">
        <div className="flex flex-col text-center w-full mb-12">
          <h2 className="max-w-xl font-bold text-3xl lg:text-5xl tracking-tight mb-4 mx-auto">
            Simple, transparent pricing
          </h2>
          <div className="text-base-content-secondary max-w-md mx-auto mb-12">
            Get full access to JobTrackr with a single payment.
          </div>
        </div>
        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch">
          <div className="card bordered lg:card-side bg-base-300 shadow-xl">
            <div className="card-body">
              <div className="flex flex-wrap gap-2 mb-4">
                <p className="text-5xl tracking-tight font-extrabold">$29</p>
                <div className="flex flex-col justify-end">
                  <p className="text-xs text-base-content/60 uppercase font-semibold">One-time payment</p>
                </div>
              </div>
              <ul className="space-y-2.5 leading-relaxed text-base flex-1 mb-6">
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
                  <span>Quick add with URL assist</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] opacity-80 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Set daily goals and track your progress effortlessly</span>
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
  );
};

export default PricingSection;
