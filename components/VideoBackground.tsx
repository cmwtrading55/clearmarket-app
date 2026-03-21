"use client";

import { useEffect, useRef, useState } from "react";

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  overlayOpacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function VideoBackground({
  src,
  poster,
  overlayOpacity = 0.6,
  className = "",
  children,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // Slow down for more cinematic feel
    }
  }, []);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Dark Agri-DeFi Overlay */}
      <div
        className="absolute inset-0 bg-background/80"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(10, 10, 15, ${overlayOpacity}) 0%, 
            rgba(10, 10, 15, ${overlayOpacity * 0.8}) 50%, 
            rgba(10, 10, 15, 1) 100%)`,
        }}
      />

      {/* Primary Purple Glow */}
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
