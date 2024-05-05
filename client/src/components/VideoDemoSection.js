import React from 'react';

const YouTubeSection = () => {
  return (
    <section className="bg-base-300 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-base-content sm:text-4xl">
            See JobTrackr in Action
          </h2>
          <p className="mt-4 text-xl text-base-content">
            Watch our video to learn how JobTrackr can simplify your job search.
          </p>
        </div>
        <div className="mt-12 flex justify-center">
          <div className="relative w-full max-w-4xl">
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="JobTrackr Video"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;