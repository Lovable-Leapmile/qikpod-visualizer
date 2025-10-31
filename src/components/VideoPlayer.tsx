import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  src: string;
  onEnded?: () => void;
}

export const VideoPlayer = ({ src, onEnded }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, [src]);

  return (
    <div className="fixed inset-0 bg-background p-5">
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
    </div>
  );
};
