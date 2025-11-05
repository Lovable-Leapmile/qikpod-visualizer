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
  | "AMR"
  | "SHUTTLE" 
  | "SCISSORLIFT"
  | "CONVEYOR"
  | "LOCKER"
  | "BAYDOOR"
  | "ALL";

export const VIDEO_MAP: Record<VideoAction, string> = {
  SCARA: "/videos/SCARA.jpeg",
  AMR: "/videos/AMR.jpeg",
  SHUTTLE: "/videos/SHUTTLE.jpeg",
  SCISSORLIFT: "/videos/SCISSORLIFT.jpeg",
  CONVEYOR: "/videos/CONVEYOR.jpeg",
  LOCKER: "/videos/LOCKER.jpeg",
  BAYDOOR: "/videos/BAYDOOR.jpeg",
  ALL: "/videos/ALL.mp4",
};
