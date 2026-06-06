"use client";
import { useState, useRef, useEffect } from "react";
import { 
  Sparkles, Send, Loader2, Command, Zap, Activity, 
  CalendarDays, Users, ClipboardList, AlertTriangle, 
  Inbox, DollarSign, Truck, Trash2, ArrowRight, X, HelpCircle, RefreshCw
} from "lucide-react";

const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";

type Msg = { role: "user" | "assistant"; text: string; error?: boolean };

// Core AI communication function connected to our backend
async function getAIResponse(userMsg: string, messageHistory: Msg[]): Promise<{ text: string }> {
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
  
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.final_response || errData.reply || "Connection to the core failed.");
  }
  
  const data = await res.json();
  return { text: data.reply || data.final_response };
}

const ACTION_CARDS = [
  { 
    title: "Today's Bookings", 
    desc: "Check schedule and operations for today", 
    prompt: "Show today’s bookings", 
    icon: CalendarDays,
    color: "from-blue-500/5 to-indigo-500/5 hover:border-blue-300 border-slate-100" 
  },
  { 
    title: "Pending Reviews", 
    desc: "Summarize pending event booking reviews", 
    prompt: "Summarize pending reviews", 
    icon: AlertTriangle,
    color: "from-amber-500/5 to-orange-500/5 hover:border-amber-300 border-slate-100" 
  },
  { 
    title: "Unpaid Bookings", 
    desc: "Check bookings awaiting client payment", 
    prompt: "Show unpaid bookings", 
    icon: DollarSign,
    color: "from-rose-500/5 to-red-500/5 hover:border-rose-300 border-slate-100" 
  },
  { 
    title: "New Inquiries", 
    desc: "See recent AI customer chat leads", 
    prompt: "Show new inquiries", 
    icon: Inbox,
    color: "from-emerald-500/5 to-teal-500/5 hover:border-emerald-300 border-slate-100" 
  },
  { 
    title: "Open Tasks", 
    desc: "View active tasks and todo checklists", 
    prompt: "Show open tasks", 
    icon: ClipboardList,
    color: "from-purple-500/5 to-violet-500/5 hover:border-purple-300 border-slate-100" 
  },
  { 
    title: "Revenue Analysis", 
    desc: "Analyze overall revenue stats this week", 
    prompt: "Analyze revenue this week", 
    icon: Activity,
    color: "from-pink-500/5 to-rose-500/5 hover:border-pink-300 border-slate-100" 
  },
  { 
    title: "Fleet Availability", 
    desc: "Status of vehicles and fleet assets", 
    prompt: "Show fleet availability", 
    icon: Truck,
    color: "from-cyan-500/5 to-blue-500/5 hover:border-cyan-300 border-slate-100" 
  },
];

export default function AICopilotPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "## Welcome to the Legend Copilot\n\nI am your advanced AI operations assistant. I have full read access to bookings, fleet status, revenue, and tasks.\n\n**How can I help you optimize Boston Legend today?**" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoad] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
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
    setShowSidebar(false);
    try {
      const res = await getAIResponse(msg, msgs);
      setMsgs(p => [...p, { role: "assistant", text: res.text }]);
    } catch (err: any) {
      setMsgs(p => [...p, { role: "assistant", text: `⚠️ **Error:** ${err?.message || "Failed to process prompt. Please try again."}`, error: true }]);
    } finally { setLoad(false); }
  };

  const formatText = (t: string) => {
    return t.split(/\r?\n|\\n/).map((line, i) => {
      // Basic markdown styling for the copilot
      if (line.startsWith("## ")) {
        return <h2 key={i} className="text-lg font-black mt-5 mb-2.5 flex items-center gap-2 text-[#000223] border-b border-slate-100 pb-2">{line.replace("## ", "")}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={i} className="text-sm font-bold mt-4 mb-2 flex items-center gap-2 text-[#000223]">{line.replace("### ", "")}</h3>;
      }
      if (line.startsWith("- ")) {
        return (
          <div key={i} className="flex gap-2.5 items-start my-2 ml-2 font-semibold">
            <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-[#FFA000]" />
            <span className="text-slate-650">
              {line.replace("- ", "").split(/\*\*(.+?)\*\*/g).map((part, j) => j % 2 === 1 ? <strong key={j} className="text-[#000223] font-black">{part}</strong> : part)}
            </span>
          </div>
        );
      }
      // Check for table structure if line contains pipes
      if (line.startsWith("|") && line.endsWith("|")) {
        const cells = line.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        // Skip separator line |---|---|
        if (cells.every(c => c.match(/^:-*-?:?$/) || c.match(/^-+$/))) return null;
        return (
          <div key={i} className="grid grid-cols-4 gap-4 py-2.5 border-b border-slate-100 text-xs font-bold text-slate-700 bg-[#FAF8F0]/30 hover:bg-[#FAF8F0]/80 px-2 rounded-lg transition-colors">
            {cells.map((cell, idx) => (
              <div key={idx} className="truncate text-[#000223]">{cell}</div>
            ))}
          </div>
        );
      }
      return (
        <span key={i} className="block my-2 text-slate-600 font-semibold leading-relaxed">
          {line.split(/\*\*(.+?)\*\*/g).map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="text-[#000223] font-black">{part}</strong> : part
          )}
        </span>
      );
    });
  };

  return (
    <div className="space-y-6 pb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFA000] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Operations Control</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#000223]">AI Operations Copilot</h1>
          <p className="text-slate-500 font-semibold mt-1 text-sm">Real-time scheduling queries, fleet management, and business logic automation</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-14rem)] min-h-[500px] rounded-3xl overflow-hidden bg-white shadow-md border border-slate-200/80">
        
        {/* LEFT: Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAF8F0]/30 relative">
          
          {/* Top Panel Bar */}
          <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-white z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#000223] p-1.5 flex items-center justify-center shadow-md border border-white/10">
                <img src={LOGO} alt="" className="w-full h-full object-contain filter brightness-0 invert" />
              </div>
              <div>
                <div className="text-[#000223] font-black text-sm tracking-tight flex items-center gap-1.5">
                  Legend Copilot v2.0
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md bg-emerald-50 text-[9px] font-black text-emerald-600 uppercase tracking-wider border border-emerald-200">Database Connected</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFA000] fill-[#FFA000]/10" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Assistant</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setMsgs([{ role: "assistant", text: "## Welcome to the Legend Copilot\n\nI am your advanced AI operations assistant. I have full read access to bookings, fleet status, revenue, and tasks.\n\n**How can I help you optimize Boston Legend today?**" }])}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-all"
                title="Clear Conversation"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
              <button 
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden px-4 py-2 rounded-xl bg-[#000223] text-white hover:bg-[#FFA000] hover:text-[#000223] text-xs font-black transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-[#FFA000]" /> Copilot Actions
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Quick Helper Badge */}
            {msgs.length === 1 && (
              <div className="bg-[#FAF6EF]/60 rounded-2xl border border-slate-200/80 p-5 max-w-xl mx-auto space-y-3 shadow-sm text-center">
                <HelpCircle className="w-8 h-8 text-[#FFA000] mx-auto" />
                <h3 className="text-sm font-black text-[#000223] uppercase tracking-wider">What can I ask Copilot?</h3>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  You can type natural language instructions to query operations, analyze schedules, list fleet components, or calculate revenue:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#000223] font-black text-left">
                  <div className="bg-white px-3 py-2 rounded-lg border border-slate-100">"Show today's bookings"</div>
                  <div className="bg-white px-3 py-2 rounded-lg border border-slate-100">"Summarize pending reviews"</div>
                  <div className="bg-white px-3 py-2 rounded-lg border border-slate-100">"Analyze revenue this week"</div>
                  <div className="bg-white px-3 py-2 rounded-lg border border-slate-100">"Show fleet availability"</div>
                </div>
              </div>
            )}

            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-start gap-3`}>
                {m.role === "assistant" && (
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 p-1 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    <img src={LOGO} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
                
                <div 
                  className={`max-w-[85%] rounded-[20px] px-5 py-3.5 text-sm shadow-sm transition-all border ${
                    m.role === "user" 
                    ? "bg-[#000223] text-white rounded-tr-none border-[#FFA000]/10" 
                    : m.error 
                    ? "bg-red-50 text-red-800 border-red-150 rounded-tl-none"
                    : "bg-white text-slate-700 border-slate-200/80 rounded-tl-none"
                  }`}
                >
                  {formatText(m.text)}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 p-1 shadow-sm flex items-center justify-center flex-shrink-0">
                  <img src={LOGO} alt="" className="w-full h-full object-contain animate-spin" style={{ animationDuration: "3s" }} />
                </div>
                <div className="bg-white rounded-[20px] rounded-tl-none px-5 py-3.5 shadow-sm border border-slate-200/80 flex items-center gap-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-[#FFA000]" />
                  <span className="text-xs text-slate-400 font-extrabold tracking-wide">Querying live database...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200/80">
            <div className="flex items-center gap-2 p-1.5 rounded-[18px] bg-slate-50 border border-slate-200/80 focus-within:border-[#FFA000] focus-within:ring-4 focus-within:ring-[#FFA000]/10 transition-all">
              <div className="pl-3 hidden sm:block">
                <Command className="w-4.5 h-4.5 text-slate-400" />
              </div>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Ask Copilot: 'Show today's bookings' or 'Analyze revenue'..."
                className="flex-1 bg-transparent py-2.5 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 text-[16px]"
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-[12px] flex items-center justify-center transition-all disabled:opacity-40 hover:scale-102 active:scale-98 bg-[#000223] shadow-md flex-shrink-0"
              >
                <Send className="w-4 h-4 text-[#FFA000]" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Suggested Prompts Sidebar */}
        <div 
          className={`fixed inset-y-0 right-0 z-40 w-80 bg-white border-l border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
            showSidebar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FFA000]" />
              <span className="font-black text-sm text-[#000223] uppercase tracking-wider">Quick Actions</span>
            </div>
            <button className="lg:hidden text-slate-400 hover:text-slate-700" onClick={() => setShowSidebar(false)}>
              <X className="w-5.5 h-5.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggested Prompts</p>
            <div className="space-y-3">
              {ACTION_CARDS.map(card => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.title}
                    onClick={() => send(card.prompt)}
                    disabled={loading}
                    className={`w-full text-left p-3.5 rounded-2xl border border-slate-100 bg-gradient-to-br ${card.color} transition-all hover:scale-[1.01] hover:shadow-sm active:scale-[0.99] flex gap-3 group`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-slate-200/50">
                      <Icon className="w-4.5 h-4.5 text-[#000223]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-xs text-[#000223] flex items-center gap-1 group-hover:text-[#FFA000] transition-colors">
                        {card.title} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-[10px] text-slate-450 font-bold mt-0.5 leading-snug">{card.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 border-t border-slate-100 bg-slate-50/30">
            <div className="text-[10px] text-slate-400 font-bold leading-normal">
              💡 **Info:** Copilot pulls data directly from bookings, customers, fleet management, and settings tables to generate summary metrics.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
