"use client";
import React, { useEffect, useRef } from "react";

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applyMotionPreference = () => {
      if (reduceMotion.matches) {
        videoRef.current?.pause();
      }
    };

    applyMotionPreference();
    reduceMotion.addEventListener("change", applyMotionPreference);

    return () => {
      reduceMotion.removeEventListener("change", applyMotionPreference);
    };
  }, []);

  return (
    <div
      className="relative inset-0 w-screen h-screen -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/episodeSectionBg.jpg"
        className="w-full h-full object-cover"
      >
        <source src="/H2.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
};

export default VideoBackground;
