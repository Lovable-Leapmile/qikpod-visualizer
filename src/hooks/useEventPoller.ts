import { useState, useEffect, useCallback } from "react";
import { fetchLatestEvent } from "@/services/apiService";
import { VideoAction, VIDEO_MAP } from "@/types/api";

const POLL_INTERVAL = 5000; // 5 seconds
const AUTO_SWITCH_DELAY = 120000; // 2 minutes
const SLIDESHOW_INTERVAL = 10000; // 10 seconds per image
const VALID_ACTIONS: VideoAction[] = [
  "SCARA",
  "SHUTTLE",
  "SCISSORLIFT",
  "CONVEYOR",
  "LOCKER",
  "BAYDOOR",
  "AMR",
];

export const useEventPoller = () => {
  const [currentVideo, setCurrentVideo] = useState<string>(VIDEO_MAP.SCARA);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "error" | "idle">("idle");
  const [lastAction, setLastAction] = useState<string>("");
  const [autoSwitchTimer, setAutoSwitchTimer] = useState<NodeJS.Timeout | null>(null);
  const [slideshowTimer, setSlideshowTimer] = useState<NodeJS.Timeout | null>(null);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const stopSlideshow = useCallback(() => {
    if (slideshowTimer) {
      clearTimeout(slideshowTimer);
      setSlideshowTimer(null);
    }
    setIsSlideshow(false);
  }, [slideshowTimer]);

  const startSlideshow = useCallback(() => {
    setIsSlideshow(true);
    setCurrentSlideIndex(0);
    setCurrentVideo(VIDEO_MAP[VALID_ACTIONS[0]]);
  }, []);

  const handleNewAction = useCallback(
    (action: string) => {
      if (VALID_ACTIONS.includes(action as VideoAction)) {
        const videoPath = VIDEO_MAP[action as VideoAction];
        
        // Stop any slideshow
        stopSlideshow();
        
        // Clear any existing auto-switch timer
        if (autoSwitchTimer) {
          clearTimeout(autoSwitchTimer);
        }

        // Switch to the new video
        setCurrentVideo(videoPath);
        setLastAction(action);

        // Set timer to start slideshow after 2 minutes
        const timer = setTimeout(() => {
          startSlideshow();
        }, AUTO_SWITCH_DELAY);

        setAutoSwitchTimer(timer);
      }
    },
    [autoSwitchTimer, stopSlideshow, startSlideshow]
  );

  const pollApi = useCallback(async () => {
    try {
      const data = await fetchLatestEvent();
      
      if (data && data.records && data.records.length > 0) {
        const latestRecord = data.records[0];
        const action = latestRecord?.message?.action;

        if (action && action !== lastAction) {
          handleNewAction(action);
        }

        setConnectionStatus("connected");
      } else {
        setConnectionStatus("idle");
      }
    } catch (error) {
      console.error("Polling error:", error);
      setConnectionStatus("error");
    }
  }, [lastAction, handleNewAction]);

  // Handle slideshow cycling
  useEffect(() => {
    if (isSlideshow) {
      const timer = setTimeout(() => {
        const nextIndex = (currentSlideIndex + 1) % VALID_ACTIONS.length;
        setCurrentSlideIndex(nextIndex);
        setCurrentVideo(VIDEO_MAP[VALID_ACTIONS[nextIndex]]);
      }, SLIDESHOW_INTERVAL);
      
      setSlideshowTimer(timer);
      
      return () => clearTimeout(timer);
    }
  }, [isSlideshow, currentSlideIndex]);

  useEffect(() => {
    // Start polling immediately
    pollApi();

    // Set up interval for continuous polling
    const intervalId = setInterval(pollApi, POLL_INTERVAL);

    return () => {
      clearInterval(intervalId);
      if (autoSwitchTimer) {
        clearTimeout(autoSwitchTimer);
      }
      if (slideshowTimer) {
        clearTimeout(slideshowTimer);
      }
    };
  }, [pollApi, autoSwitchTimer, slideshowTimer]);

  return {
    currentVideo,
    connectionStatus,
    lastAction,
  };
};
