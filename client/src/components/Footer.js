import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-base-300/50 border-t border-base-content/10">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className="flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <a href="/" className="flex gap-2 justify-center md:justify-start items-center">
              <img src="/logo.png" alt="JobTrackr Logo" className="w-6 h-6" />
              <strong className="font-extrabold tracking-tight text-base md:text-lg">JobTrackr</strong>
            </a>
            <p className="mt-3 text-sm text-base-content/80">
              Simplify your job search with JobTrackr's quick add and URL add features for efficient application tracking.
            </p>
            <p className="mt-3 text-sm text-base-content/60">
              &copy; {new Date().getFullYear()} JobTrackr. All rights reserved.
            </p>
          </div>
          <div className="flex-grow flex flex-wrap justify-center -mb-10 md:mt-0 mt-10 text-center md:pl-24">
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="footer-title font-semibold text-base-content tracking-widest text-sm md:text-left mb-3">
                LINKS
              </div>
              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                <a href="/" className="link link-hover">Home</a>
                <a href="/#features" className="link link-hover">Features</a>
                <a href="/#pricing" className="link link-hover">Pricing</a>
                <a href="/#faq" className="link link-hover">FAQ</a>
              </div>
            </div>
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="footer-title font-semibold text-base-content tracking-widest text-sm md:text-left mb-3">
                LEGAL
              </div>
              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                <a href="/terms" className="link link-hover">Terms of Service</a>
                <a href="/privacy" className="link link-hover">Privacy Policy</a>
              </div>
            </div>
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="footer-title font-semibold text-base-content tracking-widest text-sm md:text-left mb-3">
                CONTACT
              </div>
              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                <a href="mailto:support@jobtrackr.com" className="link link-hover">Support</a>
                <a href="/contact" className="link link-hover">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;