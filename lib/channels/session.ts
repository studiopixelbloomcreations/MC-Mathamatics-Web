import { createAdminClient } from "@/lib/supabase/server";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export interface ChatSessionData {
  id: string;
  channel: string;
  sender_id: string;
  student_id: string | null;
  student_unique_id: string | null;
  messages: ChatMessage[];
}

// In-memory fallback if the table hasn't been created yet in Postgres
const memorySessions = new Map<string, ChatSessionData>();

/**
 * Loads or creates a persistent chat session for a user on Telegram or WhatsApp.
 */
export async function getOrCreateSession(
  channel: string,
  senderId: string
): Promise<ChatSessionData> {
  const sessionId = `${channel}:${senderId}`;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .eq("id", sessionId)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        channel: data.channel,
        sender_id: data.sender_id,
        student_id: data.student_id,
        student_unique_id: data.student_unique_id,
        messages: Array.isArray(data.messages) ? data.messages : [],
      };
    }
  } catch (e) {
    // Supabase table may not exist yet, fallback to memory
  }

  const existingMem = memorySessions.get(sessionId);
  if (existingMem) return existingMem;

  const newSession: ChatSessionData = {
    id: sessionId,
    channel,
    sender_id: senderId,
    student_id: null,
    student_unique_id: null,
    messages: [],
  };

  memorySessions.set(sessionId, newSession);
  return newSession;
}

/**
 * Updates session data (linked student and appended messages)
 */
export async function saveSession(
  session: ChatSessionData,
  newMessage?: { role: "user" | "assistant"; content: string }
): Promise<void> {
  if (newMessage) {
    session.messages.push({
      ...newMessage,
      timestamp: new Date().toISOString(),
    });

    // Keep history sliding window (last 20 messages for prompt efficiency)
    if (session.messages.length > 20) {
      session.messages = session.messages.slice(-20);
    }
  }

  memorySessions.set(session.id, session);

  try {
    const supabase = createAdminClient();
    await supabase.from("chat_sessions").upsert({
      id: session.id,
      channel: session.channel,
      sender_id: session.sender_id,
      student_id: session.student_id,
      student_unique_id: session.student_unique_id,
      messages: session.messages,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    // Memory fallback will still maintain session within server instance
  }
}
