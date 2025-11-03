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
  SCARA: "/videos/SCARA.jpg",
  SHUTTLE: "/videos/SHUTTLE.jpg",
  SCISSORLIFT: "/videos/SCISSORLIFT.jpg",
  CONVEYOR: "/videos/CONVEYOR.jpg",
  LOCKER: "/videos/LOCKER.jpg",
  BAYDOOR: "/videos/BAYDOOR.jpg",
  ALL: "/videos/ALL.mp4",
};
