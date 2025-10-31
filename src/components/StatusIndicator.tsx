import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusIndicatorProps {
  status: "connected" | "error" | "idle";
  lastAction: string;
}

export const StatusIndicator = ({ status, lastAction }: StatusIndicatorProps) => {
  const statusColors = {
    connected: "bg-status-connected",
    error: "bg-status-error",
    idle: "bg-status-idle",
  };

  const statusLabels = {
    connected: "Connected",
    error: "Error",
    idle: "Monitoring",
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-4 py-3 shadow-lg">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${statusColors[status]} animate-pulse`} />
        <span className="text-sm font-medium text-foreground">
          {statusLabels[status]}
        </span>
      </div>
      
      {lastAction && (
        <>
          <div className="w-px h-4 bg-border" />
          <Badge variant="secondary" className="text-xs font-mono">
            <Activity className="w-3 h-3 mr-1" />
            {lastAction}
          </Badge>
        </>
      )}
    </div>
  );
};
