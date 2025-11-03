import { VideoPlayer } from "@/components/VideoPlayer";
import { StatusIndicator } from "@/components/StatusIndicator";
import { useEventPoller } from "@/hooks/useEventPoller";
const Index = () => {
  const {
    currentVideo,
    connectionStatus,
    lastAction
  } = useEventPoller();
  return <div className="relative w-full h-screen overflow-hidden bg-background">
      <VideoPlayer src={currentVideo} />
      
    </div>;
};
export default Index;