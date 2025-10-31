import { useState, useEffect, useCallback } from "react";
import { fetchLatestEvent } from "@/services/apiService";
import { VideoAction, VIDEO_MAP } from "@/types/api";

const POLL_INTERVAL = 5000; // 5 seconds
const AUTO_SWITCH_DELAY = 60000; // 1 minute
const VALID_ACTIONS: VideoAction[] = [
  "SCARA",
  "SHUTTLE",
  "SCISSORLIFT",
  "CONVEYOR",
  "LOCKER",
  "BAYDOOR",
];

export const useEventPoller = () => {
  const [currentVideo, setCurrentVideo] = useState<string>(VIDEO_MAP.ALL);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "error" | "idle">("idle");
  const [lastAction, setLastAction] = useState<string>("");
  const [autoSwitchTimer, setAutoSwitchTimer] = useState<NodeJS.Timeout | null>(null);

  const switchToAll = useCallback(() => {
    setCurrentVideo(VIDEO_MAP.ALL);
    setLastAction("");
  }, []);

  const handleNewAction = useCallback(
    (action: string) => {
      if (VALID_ACTIONS.includes(action as VideoAction)) {
        const videoPath = VIDEO_MAP[action as VideoAction];
        
        // Clear any existing auto-switch timer
        if (autoSwitchTimer) {
          clearTimeout(autoSwitchTimer);
        }

        // Switch to the new video
        setCurrentVideo(videoPath);
        setLastAction(action);

        // Set timer to switch back to ALL.mp4 after 1 minute
        const timer = setTimeout(() => {
          switchToAll();
        }, AUTO_SWITCH_DELAY);

        setAutoSwitchTimer(timer);
      }
    },
    [autoSwitchTimer, switchToAll]
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
        // No records - switch to ALL.mp4
        if (currentVideo !== VIDEO_MAP.ALL) {
          switchToAll();
        }
        setConnectionStatus("idle");
      }
    } catch (error) {
      console.error("Polling error:", error);
      setConnectionStatus("error");
    }
  }, [lastAction, handleNewAction, currentVideo, switchToAll]);

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
    };
  }, [pollApi, autoSwitchTimer]);

  return {
    currentVideo,
    connectionStatus,
    lastAction,
  };
};
