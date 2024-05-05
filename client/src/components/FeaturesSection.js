import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="features-section py-24 md:py-32 space-y-24 md:space-y-32 max-w-5xl mx-auto bg-base-100" id="features">
      <div className="px-8">
        <h2 className="font-extrabold text-4xl lg:text-5xl tracking-tight mb-12 md:mb-24">Key Features of JobTrackr</h2>
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="grid grid-cols-1 items-stretch gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-24">
            <ul className="w-full">
              <li className="border-b">
                <div className="relative flex gap-2 items-center w-full py-4 text-base font-medium text-left md:text-lg">
                  <span className="duration-100 text-primary">1.</span>
                  <span className="flex-1 text-base-content text-primary font-semibold">Quick Add Feature</span>
                </div>
                <div className="pb-8 text-base-content-secondary">
                  <p>Easily add job applications using the quick add feature. Input job details manually in a user-friendly modal for efficient tracking.</p>
                </div>
              </li>
              <li className="border-b">
                <div className="relative flex gap-2 items-center w-full py-4 text-base font-medium text-left md:text-lg">
                  <span className="duration-100">2.</span>
                  <span className="flex-1 text-base-content">URL Add Feature</span>
                </div>
                <div className="pb-8 text-base-content-secondary">
                  <p>Save time by adding job applications directly from LinkedIn and Indeed. Simply paste the job URL, and JobTrackr will extract the relevant details.</p>
                </div>
              </li>
              <li>
                <div className="relative flex gap-2 items-center w-full py-4 text-base font-medium text-left md:text-lg">
                  <span className="duration-100">3.</span>
                  <span className="flex-1 text-base-content">Centralized Dashboard</span>
                </div>
                <div className="pb-8 text-base-content-secondary">
                  <p>Stay organized with a centralized dashboard that provides an overview of all your job applications. Easily track the status and progress of each application.</p>
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
  );
};

export default FeaturesSection;