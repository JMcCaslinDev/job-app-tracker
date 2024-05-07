import React, { useState } from 'react';

const FAQSection = () => {
  const [openFaqs, setOpenFaqs] = useState({});

  const faqs = [
    {
      question: 'Why do I need JobTrackr?',
      answer: 'To streamline job search and save time during the process.',
    },
    {
      question: 'Is there a subscription model for JobTrackr?',
      answer: 'No, JobTrackr is available through a one-time purchase of $29 only.',
    },
    {
      question: 'Does JobTrackr support application tracking for multiple job platforms?',
      answer: 'Yes, JobTrackr supports tracking applications from multiple job platforms including LinkedIn and Indeed.',
    },
    {
      question: 'Can I use JobTrackr on mobile devices?',
      answer: 'JobTrackr is optimized for use on desktop browsers to provide the best user experience.',
    },
    {
      question: 'Is my personal information secure with JobTrackr?',
      answer: 'Absolutely, we use advanced encryption to ensure all your data is secure.',
    },
    {
      question: 'Can I manually add job applications to JobTrackr?',
      answer: 'Yes, you can manually enter each job application\'s details into JobTrackr.',
    },
    {
      question: 'Are there any hidden fees or additional costs with JobTrackr?',
      answer: 'No, there are no hidden fees; the one-time purchase gives you full access to all features.',
    },
    {
      question: 'How can I update my job application information in JobTrackr?',
      answer: 'You can easily update or modify any application details at any time within JobTrackr.',
    },
    {
      question: 'How often is JobTrackr updated with new features?',
      answer: 'We continuously work to improve JobTrackr and release updates as new features are developed.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section className="bg-base-200" id="faq">
      <div className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex flex-col text-left md:basis-1/2">
            <p className="inline-block font-semibold text-primary mb-4">FAQ</p>
            <p className="text-3xl md:text-4xl font-extrabold text-base-content">Frequently Asked Questions</p>
          </div>
          <ul className="md:basis-1/2 divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <li key={index} className="group">
                <button
                  className={`flex items-center justify-between w-full py-5 text-base font-semibold text-left ${
                    openFaqs[index] ? 'text-primary' : 'text-base-content'
                  } focus:outline-none focus:bg-transparent`}
                  onClick={() => toggleFAQ(index)}
                  style={{ backgroundColor: 'transparent' }}
                >
                  <span>{faq.question}</span>
                  <svg
                    className={`w-6 h-6 ml-4 transition-transform duration-300 ${
                      openFaqs[index] ? 'rotate-180' : ''
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"x
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    openFaqs[index] ? 'max-h-screen' : 'max-h-0'
                  }`}
                >
                  <div className="py-4">{faq.answer}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
