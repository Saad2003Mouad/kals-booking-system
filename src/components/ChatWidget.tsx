"use client";
import { useState, useRef, useEffect, useCallback, memo } from "react";
import { X, Send, Loader2, Minus, Sparkles, MessageSquare } from "lucide-react";

const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";
const BOOKING_URL = "/booking";
const PHONE = "617-999-3803";
const BRAND_NAVY = "#000223";
const BRAND_GOLD = "#FFA000";

type Msg = { role: "user" | "assistant"; content: string; ts: Date };

const QUICK_REPLIES = [
  { label: "Pricing & Packages", text: "Tell me about your packages and pricing." },
  { label: "How to Book",        text: "How do I book the ice cream truck?" },
  { label: "Flavors & Menu",     text: "What ice cream flavors do you offer?" },
  { label: "Service Area",       text: "What areas do you serve in Greater Boston?" },
];

const WELCOME: Msg = {
  role: "assistant",
  content: `Welcome to **Boston Legend** 🎉\n\nI'm your dedicated event concierge. I can help you:\n\n• **Explore packages & pricing** for any event size\n• **Plan your booking** from start to finish\n• **Answer any questions** about flavors, logistics & policies\n\nWhat can I help you with today?`,
  ts: new Date(),
};

function renderMarkdown(text: string) {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2" target="_blank" rel="noopener" style="color:${BRAND_GOLD};font-weight:700;text-decoration:underline;text-underline-offset:2px;">$1</a>`)
    .replace(/\n/g, "<br/>");
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

const BotAvatar = memo(function BotAvatar({ size = 32 }: { size?: number }) {
  return (
    <div
      aria-hidden
      style={{
        width: size, height: size,
        borderRadius: "50%",
        background: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 0 0 1.5px ${BRAND_NAVY}15, 0 2px 8px rgba(0,0,0,0.08)`,
        padding: Math.round(size * 0.13),
        overflow: "hidden",
      }}
    >
      <img src={LOGO} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
});

const MessageBubble = memo(function MessageBubble({ msg }: { msg: Msg }) {
  const isBot = msg.role === "assistant";
  return (
    <div className={`flex gap-2.5 ${isBot ? "justify-start" : "justify-end"} mb-4`}>
      {isBot && <BotAvatar />}
      <div
        className="max-w-[82%] px-4 py-3 text-sm leading-relaxed"
        style={isBot
          ? { background: "white", color: "#1F2937", borderRadius: "4px 16px 16px 16px", border: "1px solid #F3F4F6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", fontWeight: 500 }
          : { background: BRAND_NAVY, color: BRAND_GOLD, borderRadius: "16px 16px 4px 16px", fontWeight: 600 }
        }
      >
        {renderMarkdown(msg.content)}
        <div style={{ marginTop: 4, fontSize: 10, fontWeight: 700, opacity: 0.45, textAlign: "right", color: isBot ? "#6B7280" : BRAND_GOLD }}>
          {msg.ts.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
        </div>
      </div>
    </div>
  );
});

const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex gap-2.5 mb-4">
      <BotAvatar />
      <div className="px-4 py-3 flex items-center gap-1.5" style={{ background: "white", borderRadius: "4px 16px 16px 16px", border: "1px solid #F3F4F6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        {[0, 1, 2].map(i => (
          <span key={i} className="block w-2 h-2 rounded-full" style={{ background: BRAND_GOLD, animation: `blDot 1.3s ease-in-out ${i * 0.18}s infinite` }} />
        ))}
      </div>
    </div>
  );
});

export default function ChatWidget() {
  const [open, setOpen]           = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages]   = useState<Msg[]>([WELCOME]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [unread, setUnread]       = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  // Show greeting bubble after delay
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (open) { setUnread(0); setShowBubble(false); }
  }, [open]);

  useEffect(() => {
    if (!minimized) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, minimized]);

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: Msg = { role: "user", content, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = [...messages, userMsg].slice(-12).map(m => ({ role: m.role, content: m.content }));
      const res  = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await res.json();
      const reply = data.reply ?? `For immediate help, please call **${PHONE}** or [book online](${BOOKING_URL}).`;
      setMessages(prev => [...prev, { role: "assistant", content: reply, ts: new Date() }]);
      if (!open) setUnread(n => n + 1);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Sorry, I'm having trouble. Please call **${PHONE}** or **[book online](${BOOKING_URL})**.`,
        ts: new Date(),
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, loading, messages, open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const isFirstMessage = messages.length === 1;

  return (
    <>
      {/* ── Proactive Bubble ── */}
      {showBubble && !open && (
        <div
          role="complementary"
          aria-label="Chat with Boston Legend"
          onClick={() => setOpen(true)}
          className="fixed z-40 cursor-pointer select-none"
          style={{ bottom: 88, right: 24, animation: "blSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white max-w-[220px]"
            style={{ background: BRAND_NAVY, border: "1px solid rgba(255,160,0,0.25)" }}
          >
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <img src={LOGO} alt="" className="w-5 h-5 object-contain" />
            </div>
            <span>Planning an event? Let's chat! 👋</span>
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 right-7 w-3 h-3 rotate-45 rounded-sm" style={{ background: BRAND_NAVY }} />
        </div>
      )}

      {/* ── FAB Button ── */}
      <button
        id="bl-chat-fab"
        onClick={() => { setOpen(o => !o); setMinimized(false); }}
        className="fixed z-50 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          bottom: 24, right: 24,
          width: 56, height: 56,
          background: `linear-gradient(135deg, ${BRAND_NAVY} 0%, #001a4c 100%)`,
          border: `2px solid ${BRAND_GOLD}`,
          boxShadow: `0 8px 24px rgba(0,2,35,0.35), 0 0 0 0 rgba(255,160,0,0.4)`,
          animation: "blFabEntry 0.6s cubic-bezier(0.34,1.56,0.64,1) both 0.4s",
        }}
        aria-label={open ? "Close chat" : "Chat with Boston Legend AI Concierge"}
      >
        {open ? (
          <X className="w-5 h-5 text-white transition-all" />
        ) : (
          <div className="relative">
            <div className="flex items-center justify-center p-1">
              <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 22C16 17.58 19.58 14 24 14C28.42 14 32 17.58 32 22" stroke={BRAND_GOLD} strokeWidth="2.5" strokeLinecap="round"/>
                <ellipse cx="24" cy="22" rx="8" ry="8" fill="none" stroke={BRAND_GOLD} strokeWidth="2"/>
                <path d="M19 22 L24 38 L29 22" fill="rgba(255,160,0,0.15)" stroke={BRAND_GOLD} strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="24" cy="18" r="2.5" fill={BRAND_GOLD} opacity="0.7"/>
              </svg>
            </div>
            {/* Unread badge */}
            {unread > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 flex items-center justify-center text-[10px] font-black text-white rounded-full border-2 border-white"
                style={{ background: "#EF4444", minWidth: 18, minHeight: 18, fontSize: 10 }}
              >
                {unread}
              </span>
            )}
          </div>
        )}
      </button>

      {/* ── Chat Panel ── */}
      {open && (
        <div
          role="dialog"
          aria-label="Boston Legend AI Concierge"
          className="fixed z-50 flex flex-col overflow-hidden"
          style={{
            bottom: 92, right: 24,
            width: "min(420px, calc(100vw - 32px))",
            height: minimized ? "auto" : "min(640px, calc(100vh - 120px))",
            borderRadius: 20,
            background: "#F8F9FC",
            boxShadow: "0 24px 80px rgba(0,2,35,0.22), 0 0 0 1px rgba(0,2,35,0.08)",
            animation: "blChatOpen 0.32s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${BRAND_NAVY} 0%, #001855 100%)` }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-[rgba(255,160,0,0.15)] border border-[rgba(255,160,0,0.3)] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 22C16 17.58 19.58 14 24 14C28.42 14 32 17.58 32 22" stroke={BRAND_GOLD} strokeWidth="2.5" strokeLinecap="round"/>
                    <ellipse cx="24" cy="22" rx="8" ry="8" fill="none" stroke={BRAND_GOLD} strokeWidth="2"/>
                    <path d="M19 22 L24 38 L29 22" fill="rgba(255,160,0,0.2)" stroke={BRAND_GOLD} strokeWidth="2" strokeLinejoin="round"/>
                    <circle cx="24" cy="18" r="2.5" fill={BRAND_GOLD} opacity="0.8"/>
                  </svg>
                </div>
                {/* Online indicator */}
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                  style={{ background: "#10B981", borderColor: "#001855" }}
                />
              </div>
              <div>
                <div className="text-white font-black text-[14px] leading-tight">Boston Legend AI</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-2.5 h-2.5" style={{ color: BRAND_GOLD }} />
                  <span className="text-[11px] font-semibold" style={{ color: BRAND_GOLD }}>Event Concierge · Always Available</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMinimized(m => !m)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10 text-white/60 hover:text-white"
                aria-label={minimized ? "Expand" : "Minimize"}
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10 text-white/60 hover:text-white"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 scroll-smooth" style={{ background: "#F8F9FC" }}>
                {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                {loading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick replies (only first message) */}
              {isFirstMessage && (
                <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 flex-shrink-0" style={{ background: "#F8F9FC", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                  {QUICK_REPLIES.map(q => (
                    <button
                      key={q.label}
                      onClick={() => sendMessage(q.text)}
                      className="text-xs font-bold px-3 py-1.5 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                      style={{ background: "white", color: BRAND_NAVY, borderColor: "rgba(0,2,35,0.12)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Book CTA strip */}
              <div
                className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
                style={{ background: `rgba(255,160,0,0.08)`, borderTop: "1px solid rgba(255,160,0,0.18)" }}
              >
                <span className="text-xs font-black tracking-tight" style={{ color: BRAND_NAVY }}>Sweeten Your Next Event</span>
                <a
                  href={BOOKING_URL}
                  className="text-xs font-black px-3.5 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm"
                  style={{ background: BRAND_GOLD, color: BRAND_NAVY }}
                >
                  Book Now →
                </a>
              </div>

              {/* Input */}
              <div className="flex items-center gap-2.5 px-4 py-3 flex-shrink-0" style={{ background: "white", borderTop: "1px solid #F3F4F6" }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything…"
                  className="flex-1 text-sm font-semibold outline-none bg-transparent placeholder:text-gray-300"
                  style={{ color: BRAND_NAVY, fontFamily: "'Nunito', sans-serif" }}
                  maxLength={500}
                  autoComplete="off"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30 hover:scale-110 active:scale-95 flex-shrink-0"
                  style={{ background: input.trim() ? BRAND_GOLD : "#F3F4F6", boxShadow: input.trim() ? "0 4px 12px rgba(255,160,0,0.3)" : "none" }}
                  aria-label="Send message"
                >
                  {loading
                    ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    : <Send className="w-3.5 h-3.5" style={{ color: input.trim() ? BRAND_NAVY : "#9CA3AF" }} />
                  }
                </button>
              </div>

              {/* Footer brand strip */}
              <div className="text-center py-1.5 flex-shrink-0" style={{ background: "white" }}>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">Boston Legend · AI Powered · Secure</span>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes blChatOpen {
          from { opacity:0; transform:scale(0.92) translateY(16px); transform-origin:bottom right; }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes blSlideIn {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes blDot {
          0%,60%,100% { transform:translateY(0); opacity:0.35; }
          30%          { transform:translateY(-5px); opacity:1; }
        }
        @keyframes blFabEntry {
          from { opacity:0; transform:scale(0.6); }
          to   { opacity:1; transform:scale(1); }
        }
        #bl-chat-fab:hover {
          box-shadow: 0 12px 32px rgba(0,2,35,0.4), 0 0 0 4px rgba(255,160,0,0.2) !important;
        }
      `}</style>
    </>
  );
}
