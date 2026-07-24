// Shared domain types for VersaVid.

export type VideoFormat = "9:16" | "16:9";
export type VideoLength = "short" | "medium" | "long";
export type GenerationMode = "stock_only" | "stock_plus_ai_images" | "ai_images_only" | "ai_images_plus_ai_video";
export type VideoStatus =
  | "draft"
  | "queued"
  | "generating"
  | "ready"
  | "failed";

export type TransactionType = "purchase" | "subscription" | "usage" | "refund" | "bonus";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  country?: string;
  brand_name?: string;
  created_at: string;
  plan: 'free' | 'creator' | 'pro' | 'agency';
  monthly_video_count: number;
  signup_ip?: string | null;
}

export interface Credits {
  id: string;
  user_id: string;
  balance: number;
  total_purchased: number;
  total_used: number;
  monthly_allowance: number;
  updated_at: string;
}

export interface VideoSettings {
  scriptMode: "ai" | "upload";
  topic: string;
  format: VideoFormat;
  length: VideoLength;
  tone: string;
  generationMode: GenerationMode;
  mediaType: "images" | "videos" | "mixed";
  photoStyle: string;
  videoStyle: string;
  referenceImage?: string | null;
  voice: string;
  language: string;
  speed: "slow" | "normal" | "fast";
  captionStyle: string;
  captionPosition: "top" | "center" | "bottom";
  music: string;
}

export interface VideoRecord {
  id: string;
  user_id: string;
  title: string;
  topic: string;
  format: VideoFormat;
  status: VideoStatus;
  script: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  credits_used: number;
  duration: number; // seconds
  settings: VideoSettings;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number; // dollars
  credits: number;
  type: TransactionType;
  status: TransactionStatus;
  payment_id: string | null;
  description: string;
  created_at: string;
}

export type GenStepStatus = "waiting" | "running" | "done" | "failed";

export interface GenStep {
  key: string;
  label: string;
  description: string;
  status: GenStepStatus;
}

export interface LogEntry {
  time: string;
  message: string;
  level: "info" | "success" | "warn";
}
