import React from 'react';

const FAQSection = () => {
  return (
    <section className="bg-base-200" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex flex-col text-left basis-1/2">
            <p className="inline-block font-semibold text-primary mb-4">FAQ</p>
            <p className="text-3xl md:text-4xl font-extrabold text-base-content">Frequently Asked Questions</p>
          </div>
          <ul className="basis-1/2">
            <li>
              <button className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10">
                <span className="flex-1 text-base-content">How does the quick add feature work?</span>
                <svg className="flex-shrink-0 w-4 h-4 ml-auto fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <rect y="7" width="16" height="2" rx="1"></rect>
                  <rect y="7" width="16" height="2" rx="1" transform="rotate(90 8 8)"></rect>
                </svg>
              </button>
              <div className="transition-all duration-300 ease-in-out text-base-content-secondary overflow-hidden">
                <div className="pb-5 leading-relaxed">
                  The quick add feature allows you to manually input job details using a user-friendly modal. Simply fill in the required fields, such as company name, job title, and application date, and save the entry to start tracking the application.
                </div>
              </div>
            </li>
            <li>
              <button className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10">
                <span className="flex-1 text-base-content">How does the URL add feature work?</span>
                <svg className="flex-shrink-0 w-4 h-4 ml-auto fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <rect y="7" width="16" height="2" rx="1"></rect>
                  <rect y="7" width="16" height="2" rx="1" transform="rotate(90 8 8)"></rect>
                </svg>
              </button>
              <div className="transition-all duration-300 ease-in-out text-base-content-secondary overflow-hidden">
                <div className="pb-5 leading-relaxed">
                  The URL add feature allows you to add job applications by pasting the job listing URL from LinkedIn or Indeed. JobTrackr will automatically extract the relevant details from the URL, such as the company name and job title, saving you time and effort in manual data entry.
                </div>
              </div>
            </li>
            <li>
              <button className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10">
                <span className="flex-1 text-base-content">Is my data secure?</span>
                <svg className="flex-shrink-0 w-4 h-4 ml-auto fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <rect y="7" width="16" height="2" rx="1"></rect>
                  <rect y="7" width="16" height="2" rx="1" transform="rotate(90 8 8)"></rect>
                </svg>
              </button>
              <div className="transition-all duration-300 ease-in-out text-base-content-secondary overflow-hidden">
                <div className="pb-5 leading-relaxed">
                  Yes, your data is secure. JobTrackr uses industry-standard security measures to protect your job application data. We employ encryption, secure authentication, and regular backups to ensure the confidentiality and integrity of your information.
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;