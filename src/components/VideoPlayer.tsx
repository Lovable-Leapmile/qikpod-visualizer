import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  src: string;
  onEnded?: () => void;
}

export const VideoPlayer = ({ src, onEnded }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = src.endsWith('.mp4');

  useEffect(() => {
    if (isVideo && videoRef.current) {
      const video = videoRef.current;
      video.load();
      
      const playVideo = () => {
        video.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      };

      // Wait for video to be ready before playing
      if (video.readyState >= 3) {
        playVideo();
      } else {
        video.addEventListener('loadeddata', playVideo, { once: true });
      }

      return () => {
        video.pause();
        video.removeEventListener('loadeddata', playVideo);
      };
    }
  }, [src, isVideo]);

  return (
    <div className="fixed inset-0 bg-background p-5">
      {isVideo ? (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          loop
          muted
          autoPlay
          playsInline
          onEnded={onEnded}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={src}
          alt="Action visualization"
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
};
