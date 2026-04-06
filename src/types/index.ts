import { Tables } from "@/integrations/supabase/types";

export type Project = Tables<"projects">;
export type Document = Tables<"documents">;
export type BRD = Tables<"brds">;
export type Metric = Tables<"metrics">;
export type PipelineLog = Tables<"pipeline_logs">;
export type Profile = Tables<"profiles">;
export type ParsedDocument = Tables<"parsed_documents">;
export type AnalysisResult = Tables<"analysis_results">;
export type ChatMessage = Tables<"chat_history">;

export interface ValidationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
}

export interface BrdContent {
  [key: string]: string;
}

export interface UploadFile {
  file: File;
  type: string;
}
