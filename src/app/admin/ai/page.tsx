"use client";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, Command, Zap, Search, Activity, CalendarDays, Users } from "lucide-react";

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
    const res = await fetch("/api/admin/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        messages: messageHistory.filter(m => !m.text.includes("Welcome to the Legend Copilot")).concat({ role: "user", text: userMsg }).map(m => ({
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
  
  return { text: "Sorry, I am having trouble connecting to the legend core. Please try again later." };
}

const SUGGESTIONS = [
  { label: "Show today's operations", msg: "What's on today's schedule?", icon: CalendarDays },
  { label: "Pending booking approvals", msg: "Show pending approvals", icon: Activity },
  { label: "Fleet status overview", msg: "What's the fleet status?", icon: Zap },
  { label: "Customer insights", msg: "Show revenue snapshot and customer stats", icon: Users },
];

export default function AICopilotPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "## Welcome to the Legend Copilot\n\nI am your advanced AI operations assistant. I have full read access to bookings, fleet status, revenue, and tasks.\n\n**How can I help you optimize Boston Legend today?**" },
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

  const formatText = (t: string) => {
    return t.split("\\n").map((line, i) => {
      // Basic markdown styling for the copilot
      if (line.startsWith("## ")) {
        return <h2 key={i} className="text-xl font-black mt-3 mb-2" style={{color: "#000223"}}>{line.replace("## ", "")}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={i} className="text-lg font-black mt-2 mb-1" style={{color: "#000223"}}>{line.replace("### ", "")}</h3>;
      }
      if (line.startsWith("- ")) {
        return (
          <div key={i} className="flex gap-2 items-start my-1 ml-2">
            <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ background: "#FFA000" }} />
            <span>
              {line.replace("- ", "").split(/\\*\\*(.+?)\\*\\*/g).map((part, j) => j % 2 === 1 ? <strong key={j} className="text-[#000223] font-black">{part}</strong> : part)}
            </span>
          </div>
        );
      }
      return (
        <span key={i} className="block my-1.5">
          {line.split(/\\*\\*(.+?)\\*\\*/g).map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="text-[#000223] font-black">{part}</strong> : part
          )}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-[32px] overflow-hidden bg-white shadow-xl border border-gray-100">
      
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0" style={{ background: "linear-gradient(135deg, #000223 0%, #001840 100%)" }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-[#FFA000]/30 p-2 flex items-center justify-center">
            <img src={LOGO} alt="" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-white font-black text-xl tracking-tight">AI Operations Copilot</div>
            <div className="flex items-center gap-2 mt-1 opacity-80">
              <Sparkles className="w-3.5 h-3.5 text-[#FFA000]" />
              <span className="text-xs font-bold text-[#FFA000] uppercase tracking-widest">Boston Legend Central</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMsgs([{ role: "assistant", text: "## Welcome to the Legend Copilot\\n\\nI am your advanced AI operations assistant. I have full read access to bookings, fleet status, revenue, and tasks.\\n\\n**How can I help you optimize Boston Legend today?**" }])}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-bold transition-all flex items-center gap-2"
          >
            Clear Chat
          </button>
          <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Access
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto p-8" style={{ background: "#F4F6FA" }}>
        <div className="max-w-4xl mx-auto space-y-6">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-start gap-4`}>
              {m.role === "assistant" && (
                <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 p-1.5 shadow-sm flex items-center justify-center flex-shrink-0 mt-1">
                  <img src={LOGO} alt="" className="w-full h-full object-contain" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] rounded-[24px] px-6 py-4 text-[15px] leading-relaxed shadow-sm ${
                  m.role === "user" 
                  ? "bg-[#000223] text-white border border-[#FFA000]/30 rounded-tr-sm" 
                  : "bg-white text-slate-600 border border-gray-100 rounded-tl-sm"
                }`}
              >
                {formatText(m.text)}
                
                {/* Action Cards */}
                {m.cards && m.cards.length > 0 && (
                  <div className="mt-5 grid sm:grid-cols-2 gap-3">
                    {m.cards.map((card, ci) => (
                      <div key={ci} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <div className="font-black text-sm text-[#000223] mb-1">{card.title}</div>
                        <div className="text-xs text-slate-500 font-semibold mb-3">{card.body}</div>
                        {card.action && (
                          <button className="text-xs font-black px-4 py-2 rounded-lg bg-[#FFA000] text-[#000223] hover:bg-[#FFB020] transition-colors">
                            {card.action}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 p-1.5 shadow-sm flex items-center justify-center flex-shrink-0">
                <img src={LOGO} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="bg-white rounded-[20px] rounded-tl-sm px-6 py-4 shadow-sm border border-gray-100 flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-[#FFA000]" />
                <span className="text-sm text-gray-400 font-black tracking-wide">Processing context...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTIONS.map(s => (
              <button 
                key={s.label} 
                onClick={() => send(s.msg)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black border border-gray-200 text-slate-600 hover:border-[#FFA000] hover:text-[#000223] hover:bg-[#FFA000]/5 transition-all"
              >
                <s.icon className="w-3.5 h-3.5 text-[#FFA000]" /> {s.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 p-2 rounded-[20px] bg-slate-50 border border-slate-200 focus-within:border-[#FFA000] focus-within:ring-4 focus-within:ring-[#FFA000]/10 transition-all">
            <div className="pl-4">
              <Command className="w-5 h-5 text-slate-400" />
            </div>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask the Copilot anything..."
              className="flex-1 bg-transparent py-3 text-[15px] font-bold text-slate-800 outline-none placeholder:text-slate-400"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="w-12 h-12 rounded-[14px] flex items-center justify-center transition-all disabled:opacity-40 hover:scale-105 active:scale-95 bg-[#000223] shadow-lg"
            >
              <Send className="w-5 h-5 text-[#FFA000]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
