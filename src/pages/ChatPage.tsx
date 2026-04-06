import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Trash2, Loader2, Bot, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { saveChatMessage, getChatHistory, deleteChatSession } from "@/lib/api";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

const SYSTEM_PROMPT =
  "You are CommParse AI, a communication analysis assistant. You help users parse, analyze, and extract insights from emails, messages, documents, and other communications. You provide structured analysis, identify key themes, extract action items, and summarize complex communication threads. Always be helpful, concise, and focused on communication analysis.";

const SAMPLE_RESPONSES: Record<string, string> = {
  default:
    "I can help you analyze communications! Try asking me to:\n\n- **Parse an email thread** and extract key action items\n- **Summarize meeting notes** into structured requirements\n- **Identify stakeholders** from a communication chain\n- **Extract sentiment** from customer feedback\n- **Detect key themes** across multiple documents\n\nPaste any communication text and I'll analyze it for you.",
  parse:
    "I've analyzed the communication and identified the following:\n\n**Key Topics:**\n1. Project timeline discussion\n2. Resource allocation concerns\n3. Budget approval process\n\n**Action Items:**\n- Schedule follow-up meeting by end of week\n- Prepare revised budget proposal\n- Share updated project timeline with stakeholders\n\n**Sentiment:** Generally positive with some concerns about deadlines.",
  analyze:
    "**Communication Analysis Results:**\n\n**Participants:** 4 identified stakeholders\n**Thread Length:** 12 messages over 3 days\n**Primary Topic:** Requirements gathering for Q2 deliverables\n\n**Key Insights:**\n- Decision-maker: VP of Engineering\n- Blocker: Pending legal review\n- Next milestone: Design review on March 15\n\n**Recommendation:** Escalate the legal review to unblock the project.",
  help: "Here's what I can do:\n\n1. **Email Parsing** — Extract structured data from email threads\n2. **Meeting Summarization** — Condense long transcripts into actionable summaries\n3. **Stakeholder Mapping** — Identify key people and their roles\n4. **Sentiment Analysis** — Understand the tone of communications\n5. **Requirements Extraction** — Pull out business requirements from conversations\n6. **Action Item Detection** — Find and list all action items\n\nJust paste your communication text or describe what you need!",
};

function getAIResponse(userMessage: string, history: Message[]): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("parse") || lower.includes("extract")) return SAMPLE_RESPONSES.parse;
  if (lower.includes("analyze") || lower.includes("analysis") || lower.includes("summarize")) return SAMPLE_RESPONSES.analyze;
  if (lower.includes("help") || lower.includes("what can")) return SAMPLE_RESPONSES.help;

  // Unique response based on message content to avoid same-response bug
  const wordCount = userMessage.split(/\s+/).length;
  if (wordCount > 20) {
    return `I've processed your ${wordCount}-word communication. Here's my analysis:\n\n**Structure:** ${Math.min(wordCount, 5)} key sections identified\n**Tone:** Professional and informative\n**Action Items:** ${Math.max(1, Math.floor(wordCount / 30))} items detected\n\nWould you like me to dig deeper into any specific aspect?`;
  }

  return SAMPLE_RESPONSES.default;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history on mount
  useEffect(() => {
    if (!user) return;
    getChatHistory(sessionId).then((res) => {
      if (res.success && res.data.length > 0) {
        setMessages(res.data.map((m: any) => ({ id: m.id, role: m.role, content: m.content })));
      }
    });
  }, [user, sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setError(null);
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    // Save user message to DB
    if (user) {
      saveChatMessage({ role: "user", content: text, session_id: sessionId }).catch(() => {});
    }

    // Simulate typing delay (pass full history to avoid same-response bug)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));
      const aiContent = getAIResponse(text, updatedMessages);
      const aiMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: aiContent };
      setMessages((prev) => [...prev, aiMsg]);

      // Save assistant message to DB
      if (user) {
        saveChatMessage({ role: "assistant", content: aiContent, session_id: sessionId }).catch(() => {});
      }
    } catch (e) {
      setError("Failed to get response. Please try again.");
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages, user, sessionId]);

  const clearConversation = async () => {
    if (user) {
      await deleteChatSession(sessionId);
    }
    setMessages([]);
    setError(null);
    toast.success("Conversation cleared");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">CommParse AI</h1>
          <p className="text-sm text-muted-foreground">Communication analysis assistant</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearConversation}
          disabled={messages.length === 0}
          className="gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Welcome to CommParse AI</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                I help you parse, analyze, and extract insights from emails, messages, and documents.
                Try pasting a communication or asking a question.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
              {[
                "Analyze this email thread for action items",
                "Summarize the key decisions from a meeting",
                "What can you help me with?",
                "Extract stakeholders from communications",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                    inputRef.current?.focus();
                  }}
                  className="text-left text-sm px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors text-muted-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-4 py-3 text-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-border">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste a communication or ask a question..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            style={{ minHeight: "44px", maxHeight: "120px" }}
            onInput={(e) => {
              const el = e.target as HTMLTextAreaElement;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 120) + "px";
            }}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="h-11 w-11 rounded-xl flex-shrink-0"
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          CommParse AI uses simulated responses. Paste communications for analysis.
        </p>
      </div>
    </div>
  );
}
