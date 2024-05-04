import React from 'react';

const VideoDemoSection = () => {
  return (
    <section className="relative bg-base-100 overflow-hidden">
      <div className="relative pt-6 md:pt-12 pb-24 md:pb-48 md:px-8">
        <div className="relative max-w-4xl mx-auto">
          <div className="md:border md:p-2 md:rounded-2xl bg-base-200/70">
            <div className="relative w-full aspect-video overflow-hidden sm:rounded-xl">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="JobTrackr Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoDemoSection;