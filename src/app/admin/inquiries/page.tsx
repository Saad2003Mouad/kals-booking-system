"use client";
import { useState, useEffect, useCallback } from "react";
import { 
  Sparkles, Search, CheckCircle2, Clock, 
  XCircle, Mail, Users, MessageSquare, AlertCircle, 
  Plus, Save, Loader2, ArrowRight
} from "lucide-react";

type Inquiry = any;
type Staff = any;

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-700",
  URGENT: "bg-red-100 text-red-700",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-amber-100 text-amber-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-slate-100 text-slate-700",
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // Drawer state
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [updating, setUpdating] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resInq, resStaff] = await Promise.all([
        fetch(`/api/admin/inquiries${statusFilter !== "ALL" ? `?status=${statusFilter}` : ""}`),
        fetch(`/api/admin/users`)
      ]);
      const jsonInq = await resInq.json();
      const jsonStaff = await resStaff.json();
      
      if (resInq.ok && jsonInq.success) setInquiries(jsonInq.data);
      else setError(jsonInq.error || "Failed to fetch inquiries");

      if (resStaff.ok && jsonStaff.success) setStaffList(jsonStaff.data);
    } catch (err) {
      setError("Network error fetching inquiries");
    }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateInquiry = async (id: string, data: any) => {
    setUpdating("update");
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, ...json.data } : i));
        if (selected?.id === id) setSelected((prev: any) => ({ ...prev, ...json.data }));
      }
    } catch (e) { }
    setUpdating("");
  };

  const createTask = async () => {
    if (!newTaskTitle.trim() || !selected) return;
    setUpdating("task");
    try {
      const res = await fetch(`/api/admin/inquiries/${selected.id}/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskTitle, priority: selected.priority })
      });
      if (res.ok) {
        setNewTaskTitle("");
        setShowTaskForm(false);
        fetchData();
      }
    } catch (e) { }
    setUpdating("");
  };

  const sendEmailReply = async () => {
    if (!replyBody.trim() || !selected) return;
    setUpdating("reply");
    try {
      const res = await fetch(`/api/admin/inquiries/${selected.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: "Re: Your Inquiry with Boston Legend", body: replyBody })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setReplyBody("");
        setShowReplyForm(false);
        fetchData();
        alert("Email sent successfully!");
      } else {
        alert(json.error || "Failed to send email.");
      }
    } catch (e) { 
      alert("Network error.");
    }
    setUpdating("");
  };

  const filtered = inquiries.filter(i => 
    `${i.name} ${i.email} ${i.notes}`.toLowerCase().includes(search.toLowerCase())
  );

  if (error) return <div className="p-10 text-red-500 font-bold text-center bg-red-50 rounded-xl">{error}</div>;

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto pr-6 transition-all ${selected ? "hidden lg:block lg:w-1/2" : "w-full"}`}>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-black text-[#000223]">Inquiries</h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Manage customer questions and escalations.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/admin/export?type=inquiries"
              download
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black text-slate-600 bg-white border border-slate-200 shadow-sm hover:border-[#FFA000] hover:text-[#000223] transition-all"
            >
              Export CSV
            </a>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-premium py-2 max-w-[200px]">
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-10">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inquiries..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-blue-500" />
            </div>
          </div>
          
          {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FFA000]" /></div>
          ) : filtered.length === 0 ? (
            <div className="p-20 text-center font-bold text-slate-500">No inquiries found.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map(i => (
                <div key={i.id} onClick={() => { setSelected(i); setInternalNote(i.internalNote || ""); }} className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center gap-4 ${selected?.id === i.id ? "bg-blue-50/50" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#000223] truncate">{i.name}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${STATUS_COLORS[i.status]}`}>{i.status.replace("_", " ")}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${PRIORITY_COLORS[i.priority]}`}>{i.priority}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-500 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {i.email}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(i.createdAt).toLocaleDateString()}</span>
                      {i.assignedTo && <span className="flex items-center gap-1 text-blue-600"><Users className="w-3 h-3" /> {i.assignedTo.name}</span>}
                    </div>
                    {i.notes && <p className="text-sm font-medium text-slate-600 mt-2 line-clamp-1">{i.notes}</p>}
                  </div>
                  <div className="shrink-0 hidden sm:block text-blue-500"><ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100" /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      {selected && (
        <div className="w-full lg:w-[500px] h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col absolute right-0 top-0 lg:relative z-10 animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-black text-lg text-[#000223]">Inquiry Details</h2>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-800"><XCircle className="w-6 h-6"/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex gap-2">
              <select value={selected.status} onChange={e => updateInquiry(selected.id, { status: e.target.value })} disabled={!!updating} className="input-premium py-1.5 text-xs">
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              <select value={selected.priority} onChange={e => updateInquiry(selected.id, { priority: e.target.value })} disabled={!!updating} className="input-premium py-1.5 text-xs">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Customer Info</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm font-semibold">
                <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="text-[#000223]">{selected.name}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Email</span><a href={`mailto:${selected.email}`} className="text-blue-600">{selected.email}</a></div>
                {selected.phone && <div className="flex justify-between"><span className="text-slate-500">Phone</span><span>{selected.phone}</span></div>}
                <div className="flex justify-between"><span className="text-slate-500">Source</span><span className="text-slate-800">{selected.source}</span></div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex justify-between items-center">
                Message
                <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-xs font-bold text-blue-600 flex items-center gap-1">
                  <Mail className="w-3 h-3"/> Reply by Email
                </button>
              </h3>
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-sm font-medium text-slate-700 whitespace-pre-wrap">
                {selected.notes || "No message provided."}
              </div>

              {showReplyForm && (
                <div className="space-y-2 p-4 border border-blue-200 bg-blue-50 rounded-xl mt-2 animate-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-blue-800">Reply to: {selected.email}</label>
                  <textarea 
                    value={replyBody} onChange={e=>setReplyBody(e.target.value)} 
                    placeholder="Type your reply here..." 
                    className="input-premium w-full min-h-[100px] text-sm" 
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setShowReplyForm(false)} className="btn-secondary py-1.5 px-3 text-xs">Cancel</button>
                    <button onClick={sendEmailReply} disabled={updating === "reply"} className="btn-primary py-1.5 px-4 text-xs flex items-center gap-2">
                      {updating === "reply" ? <Loader2 className="w-3 h-3 animate-spin"/> : <Mail className="w-3 h-3"/>}
                      Send Email
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Related Records</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm font-semibold">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Customer Profile</span>
                  {selected.customerId ? (
                    <a href={`/admin/customers/${selected.customerId}`} className="text-blue-600 hover:underline flex items-center gap-1">View Profile <ArrowRight className="w-3 h-3"/></a>
                  ) : (
                    <span className="text-slate-400 italic">Not Linked</span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Related Booking</span>
                  {selected.bookingId ? (
                    <a href={`/admin/bookings/${selected.bookingId}`} className="text-blue-600 hover:underline flex items-center gap-1">View Booking <ArrowRight className="w-3 h-3"/></a>
                  ) : (
                    <span className="text-slate-400 italic">Not Linked</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Assignment</h3>
              <select 
                value={selected.assignedToId || ""} 
                onChange={e => updateInquiry(selected.id, { assignedToId: e.target.value || null })} 
                disabled={!!updating} 
                className="input-premium py-2 w-full"
              >
                <option value="">Unassigned</option>
                {staffList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role})</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Internal Notes</h3>
              <textarea 
                value={internalNote} 
                onChange={e => setInternalNote(e.target.value)} 
                onBlur={() => { if(internalNote !== selected.internalNote) updateInquiry(selected.id, { internalNote }); }}
                placeholder="Add notes for staff..." 
                className="input-premium w-full min-h-[100px] text-sm" 
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Related Tasks</h3>
                <button onClick={() => setShowTaskForm(!showTaskForm)} className="text-xs font-bold text-blue-600 flex items-center gap-1"><Plus className="w-3 h-3"/> New Task</button>
              </div>
              
              {showTaskForm && (
                <div className="flex gap-2 animate-in slide-in-from-top-2">
                  <input value={newTaskTitle} onChange={e=>setNewTaskTitle(e.target.value)} placeholder="Task title..." className="input-premium py-1.5 flex-1 text-sm" />
                  <button onClick={createTask} disabled={updating==="task"} className="btn-primary py-1.5 px-3 text-xs">Save</button>
                </div>
              )}

              {selected.tasks?.length > 0 ? (
                <div className="space-y-2">
                  {selected.tasks.map((t: any) => (
                    <div key={t.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg text-sm font-semibold">
                      <span className="text-slate-800">{t.title}</span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded">{t.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-semibold text-slate-400 italic">No tasks created yet.</p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
