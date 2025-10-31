export interface ApiMessage {
  action: string;
  timestamp?: string;
  [key: string]: any;
}

export interface ApiRecord {
  message: ApiMessage;
  id?: string;
  timestamp?: number;
}

export interface ApiResponse {
  records: ApiRecord[];
  topic?: string;
}

export type VideoAction = 
  | "SCARA"
  | "SHUTTLE" 
  | "SCISSORLIFT"
  | "CONVEYOR"
  | "LOCKER"
  | "BAYDOOR"
  | "ALL";

export const VIDEO_MAP: Record<VideoAction, string> = {
  SCARA: "/videos/SCARA.mp4",
  SHUTTLE: "/videos/SHUTTLE.mp4",
  SCISSORLIFT: "/videos/SCISSORLIFT.mp4",
  CONVEYOR: "/videos/CONVEYOR.mp4",
  LOCKER: "/videos/LOCKER.mp4",
  BAYDOOR: "/videos/BAYDOOR.mp4",
  ALL: "/videos/ALL.mp4",
};
