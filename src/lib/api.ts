import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

function ok<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

function err<T>(message: string): ApiResponse<T> {
  return { success: false, error: message };
}

async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// --- Parsed Documents ---

export const parsedDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  source_type: z.enum(["email", "transcript", "chat", "document"]).default("email"),
  parsed_data: z.record(z.unknown()).optional(),
  status: z.enum(["pending", "processing", "completed", "error"]).default("pending"),
});

export type ParsedDocumentInput = z.infer<typeof parsedDocumentSchema>;

export async function createParsedDocument(input: ParsedDocumentInput): Promise<ApiResponse<any>> {
  const parsed = parsedDocumentSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.errors[0].message);

  const userId = await getUserId();
  if (!userId) return err("Not authenticated");

  const { data, error } = await supabase
    .from("parsed_documents")
    .insert({ ...parsed.data, user_id: userId })
    .select()
    .single();

  if (error) return err(error.message);
  return ok(data);
}

export async function getParsedDocuments(): Promise<ApiResponse<any[]>> {
  const userId = await getUserId();
  if (!userId) return err("Not authenticated");

  const { data, error } = await supabase
    .from("parsed_documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return err(error.message);
  return ok(data || []);
}

export async function getParsedDocument(id: string): Promise<ApiResponse<any>> {
  const { data, error } = await supabase
    .from("parsed_documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return err(error.message);
  return ok(data);
}

export async function updateParsedDocument(id: string, input: Partial<ParsedDocumentInput>): Promise<ApiResponse<any>> {
  const { data, error } = await supabase
    .from("parsed_documents")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) return err(error.message);
  return ok(data);
}

export async function deleteParsedDocument(id: string): Promise<ApiResponse<{ id: string }>> {
  const { error } = await supabase
    .from("parsed_documents")
    .delete()
    .eq("id", id);

  if (error) return err(error.message);
  return ok({ id });
}

// --- Analysis Results ---

export const analysisResultSchema = z.object({
  document_id: z.string().uuid("Invalid document ID"),
  analysis_type: z.enum(["general", "sentiment", "entities", "summary", "requirements"]).default("general"),
  results: z.record(z.unknown()).optional(),
  summary: z.string().optional(),
});

export type AnalysisResultInput = z.infer<typeof analysisResultSchema>;

export async function createAnalysisResult(input: AnalysisResultInput): Promise<ApiResponse<any>> {
  const parsed = analysisResultSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.errors[0].message);

  const userId = await getUserId();
  if (!userId) return err("Not authenticated");

  const { data, error } = await supabase
    .from("analysis_results")
    .insert({ ...parsed.data, user_id: userId })
    .select()
    .single();

  if (error) return err(error.message);
  return ok(data);
}

export async function getAnalysisResults(documentId?: string): Promise<ApiResponse<any[]>> {
  const userId = await getUserId();
  if (!userId) return err("Not authenticated");

  let query = supabase
    .from("analysis_results")
    .select("*, parsed_documents(title)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (documentId) {
    query = query.eq("document_id", documentId);
  }

  const { data, error } = await query;
  if (error) return err(error.message);
  return ok(data || []);
}

export async function deleteAnalysisResult(id: string): Promise<ApiResponse<{ id: string }>> {
  const { error } = await supabase
    .from("analysis_results")
    .delete()
    .eq("id", id);

  if (error) return err(error.message);
  return ok({ id });
}

// --- Chat History ---

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1, "Content is required"),
  session_id: z.string().uuid().optional(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

export async function saveChatMessage(input: ChatMessageInput): Promise<ApiResponse<any>> {
  const parsed = chatMessageSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.errors[0].message);

  const userId = await getUserId();
  if (!userId) return err("Not authenticated");

  const { data, error } = await supabase
    .from("chat_history")
    .insert({ ...parsed.data, user_id: userId })
    .select()
    .single();

  if (error) return err(error.message);
  return ok(data);
}

export async function getChatHistory(sessionId: string): Promise<ApiResponse<any[]>> {
  const userId = await getUserId();
  if (!userId) return err("Not authenticated");

  const { data, error } = await supabase
    .from("chat_history")
    .select("*")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) return err(error.message);
  return ok(data || []);
}

export async function getChatSessions(): Promise<ApiResponse<any[]>> {
  const userId = await getUserId();
  if (!userId) return err("Not authenticated");

  const { data, error } = await supabase
    .from("chat_history")
    .select("session_id, content, created_at")
    .eq("user_id", userId)
    .eq("role", "user")
    .order("created_at", { ascending: false });

  if (error) return err(error.message);

  const sessions = new Map<string, { session_id: string; preview: string; created_at: string }>();
  for (const row of data || []) {
    if (!sessions.has(row.session_id)) {
      sessions.set(row.session_id, {
        session_id: row.session_id,
        preview: row.content.slice(0, 100),
        created_at: row.created_at,
      });
    }
  }
  return ok(Array.from(sessions.values()));
}

export async function deleteChatSession(sessionId: string): Promise<ApiResponse<{ session_id: string }>> {
  const userId = await getUserId();
  if (!userId) return err("Not authenticated");

  const { error } = await supabase
    .from("chat_history")
    .delete()
    .eq("user_id", userId)
    .eq("session_id", sessionId);

  if (error) return err(error.message);
  return ok({ session_id: sessionId });
}

// --- Profiles ---

export const profileUpdateSchema = z.object({
  full_name: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
});

export async function getProfile(): Promise<ApiResponse<any>> {
  const userId = await getUserId();
  if (!userId) return err("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return err(error.message);
  return ok(data);
}

export async function updateProfile(input: z.infer<typeof profileUpdateSchema>): Promise<ApiResponse<any>> {
  const parsed = profileUpdateSchema.safeParse(input);
  if (!parsed.success) return err(parsed.error.errors[0].message);

  const userId = await getUserId();
  if (!userId) return err("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", userId)
    .select()
    .single();

  if (error) return err(error.message);
  return ok(data);
}
