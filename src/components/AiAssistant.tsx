"use client";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Minimize2, Maximize2, Bot, Loader2 } from "lucide-react";

const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";

type Msg = { role: "user" | "assistant"; text: string; cards?: ActionCard[] };
type ActionCard = {
  type: "proposal" | "insight" | "conflict";
  title: string;
  body: string;
  action?: string;
  value?: string;
};

// Intelligent AI response engine for Admin operations using our new backend
async function getAIResponse(userMsg: string, messageHistory: Msg[]): Promise<{ text: string; cards?: ActionCard[] }> {
  try {
    // Send full conversation history to the API
    const res = await fetch("/api/admin/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        messages: messageHistory.filter(m => !m.text.includes("👋 Hi! I'm your Boston Legend")).concat({ role: "user", text: userMsg }).map(m => ({
          role: m.role,
          content: m.text
        }))
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      return { text: data.reply, cards: data.cards };
    }
  } catch (error) {
    console.error("Failed to get AI response:", error);
  }
  
  return {
    text: "Sorry, I am having trouble connecting to my central server right now. Please try again later.",
  };
}

const QUICK = [
  { label: "Today's schedule", msg: "What's on today's schedule?" },
  { label: "Pending reviews", msg: "Show pending approvals" },
  { label: "Fleet status", msg: "What's the fleet status?" },
  { label: "Revenue snap", msg: "Show revenue snapshot" },
];

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpand] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "👋 Hi! I'm your Boston Legend Admin Assistant. I can help with schedules, pricing, fleet status, and insights.\n\nWhat can I do for you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoad] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const send = async (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || loading) return;
    setInput("");
    setMsgs(p => [...p, { role: "user", text: msg }]);
    setLoad(true);
    try {
      const res = await getAIResponse(msg, msgs);
      setMsgs(p => [...p, { role: "assistant", ...res }]);
    } catch {
      setMsgs(p => [...p, { role: "assistant", text: "Sorry, I hit an error. Please try again." }]);
    } finally { setLoad(false); }
  };

  const formatText = (t: string) =>
    t.split("\n").map((line, i) => (
      <span key={i} className="block">
        {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
      </span>
    ));

  return (
    <>
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
          style={{ background: "linear-gradient(135deg, #000223, #002266)" }}
        >
          <Sparkles className="w-6 h-6" style={{ color: "#FFA000" }} />
        </button>
      )}

      {/* ── Admin AI Panel ── */}
      {open && (
        <div
          className={`fixed z-50 bottom-6 right-6 flex flex-col shadow-2xl rounded-[32px] overflow-hidden transition-all border border-gray-100`}
          style={{
            width: expanded ? "min(600px, 90vw)" : "min(400px, 90vw)",
            height: expanded ? "min(750px, 85vh)" : "min(580px, 80vh)",
            background: "white",
            fontFamily: "'Nunito', sans-serif",
            animation: "bl-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both"
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 flex-shrink-0" style={{ background: "#000223" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full p-1.5 flex items-center justify-center shadow-lg">
                <img src={LOGO} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <div>
                <div className="font-black text-white text-base leading-none">Admin Assistant</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Legend Console</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setExpand(!expanded)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5" style={{ background: "#F8F9FC" }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center shadow-sm border border-gray-100 mb-1">
                    <img src={LOGO} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-[20px] px-5 py-3.5 text-[14.5px] leading-relaxed shadow-sm border ${m.role === "user" ? "bg-[#000223] text-[#FFA000] border-[#FFA000]/20 rounded-br-sm" : "bg-white text-slate-700 border-gray-100 rounded-bl-sm font-medium"}`}>
                  {formatText(m.text)}
                  {m.cards && (
                    <div className="mt-4 space-y-2.5">
                      {m.cards.map((card, ci) => (
                        <div key={ci} className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 shadow-inner">
                          <div className="font-black text-[13px] uppercase tracking-tight text-navy flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FFA000]" /> {card.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-2 whitespace-pre-line font-bold leading-relaxed">{card.body}</div>
                          {card.action && (
                            <a href={`/admin/bookings/${card.value}`} className="mt-3 inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full bg-[#000223] text-[#FFA000] transition-all hover:scale-105">
                              {card.action} →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center shadow-sm border border-gray-100">
                  <img src={LOGO} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#FFA000]" />
                  <span className="text-xs text-gray-400 font-black uppercase tracking-widest">Processing Data…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick actions */}
          <div className="px-5 py-3 border-t border-gray-100 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide" style={{ background: "white" }}>
            {QUICK.map(q => (
              <button key={q.label} onClick={() => send(q.msg)} className="flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-black border-2 border-slate-100 text-slate-500 hover:border-[#FFA000] hover:text-[#000223] hover:bg-[#FFA000]/5 transition-all uppercase tracking-tighter">
                {q.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-5 border-t border-gray-100 flex gap-3 items-center flex-shrink-0" style={{ background: "white" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask for schedule, revenue, or fleet status…"
              className="flex-1 px-5 py-3 rounded-2xl border-2 border-slate-50 text-[14.5px] font-bold text-slate-800 outline-none focus:border-[#FFA000]/30 transition-all placeholder:text-slate-300"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 hover:scale-105 active:scale-95 shadow-xl"
              style={{ background: "#000223" }}
            >
              <Send className="w-5 h-5 text-[#FFA000]" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bl-pop {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
