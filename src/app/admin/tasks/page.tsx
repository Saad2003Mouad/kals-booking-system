"use client";
import { useState, useEffect, useCallback } from "react";
import { 
  CheckSquare, Search, Plus, Calendar, Clock, 
  User, CheckCircle2, XCircle, Loader2, Edit, Trash2
} from "lucide-react";

type Task = any;
type Staff = any;

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-700",
  URGENT: "bg-red-100 text-red-700",
};

const STATUS_COLORS: Record<string, string> = {
  TODO: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DONE: "bg-emerald-100 text-emerald-700",
  BLOCKED: "bg-red-100 text-red-700",
};

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", priority: "MEDIUM", status: "TODO", assignedToId: "", dueDate: "" });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resTasks, resStaff] = await Promise.all([
        fetch(`/api/admin/tasks${statusFilter !== "ALL" ? `?status=${statusFilter}` : ""}`),
        fetch(`/api/admin/users`)
      ]);
      const jsonTasks = await resTasks.json();
      const jsonStaff = await resStaff.json();
      
      if (resTasks.ok && jsonTasks.success) setTasks(jsonTasks.data);
      else setError(jsonTasks.error || "Failed to fetch tasks");

      if (resStaff.ok && jsonStaff.success) setStaffList(jsonStaff.data);
    } catch (err) {
      setError("Network error fetching tasks");
    }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => {
    setEditingTask(null);
    setFormData({ title: "", description: "", priority: "MEDIUM", status: "TODO", assignedToId: "", dueDate: "" });
    setShowModal(true);
  };

  const openEdit = (t: Task) => {
    setEditingTask(t);
    setFormData({ 
      title: t.title, 
      description: t.description || "", 
      priority: t.priority, 
      status: t.status, 
      assignedToId: t.assignedToId || "",
      dueDate: t.dueDate ? t.dueDate.split("T")[0] : ""
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingTask ? `/api/admin/tasks/${editingTask.id}` : `/api/admin/tasks`;
      const method = editingTask ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          assignedToId: formData.assignedToId || null,
          dueDate: formData.dueDate || null,
        })
      });
      
      const json = await res.json();
      if (res.ok && json.success) {
        setShowModal(false);
        fetchData();
      } else {
        alert(json.error || "Failed to save task");
      }
    } catch (err) {
      alert("Network error");
    }
    setSaving(false);
  };

  const updateStatusFast = async (id: string, status: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    try {
      await fetch(`/api/admin/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
    } catch (e) { }
  };

  const deleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`/api/admin/tasks/${id}`, { method: "DELETE" });
      if (res.ok) setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e) { }
  };

  const filtered = tasks.filter(t => 
    `${t.title} ${t.description}`.toLowerCase().includes(search.toLowerCase())
  );

  if (error) return <div className="p-10 text-red-500 font-bold text-center bg-red-50 rounded-xl">{error}</div>;

  return (
    <div>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#000223] tracking-tight flex items-center gap-3">
              <CheckSquare className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFA000]" /> 
              Task Management
            </h1>
            <p className="text-slate-500 font-semibold mt-2 text-sm sm:text-base">
              Manage operational to-dos and assignments.
            </p>
          </div>
          <button onClick={openAdd} className="btn-premium-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Create Task
          </button>
        </div>

        <div className="card-premium overflow-hidden mb-10">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex gap-4 flex-wrap bg-white">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="input-premium pl-11" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-premium max-w-[200px] cursor-pointer">
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
          
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center bg-white">
              <Loader2 className="w-10 h-10 animate-spin text-[#FFA000] mb-4" />
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading tasks...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center bg-white">
              <CheckSquare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-[#000223]">No tasks found</h3>
              <p className="text-sm font-semibold text-slate-500 mt-2">Try adjusting your filters or create a new task.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 bg-white">
              {filtered.map(t => (
                <div key={t.id} className="p-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row gap-5 group">
                  <div className="pt-1">
                    <input 
                      type="checkbox" 
                      checked={t.status === "DONE"} 
                      onChange={e => updateStatusFast(t.id, e.target.checked ? "DONE" : "TODO")}
                      className="w-6 h-6 rounded-md border-slate-300 text-[#FFA000] focus:ring-[#FFA000] focus:ring-offset-2 cursor-pointer transition-colors"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className={`font-black text-lg truncate ${t.status === "DONE" ? "text-slate-400 line-through decoration-slate-300" : "text-[#000223]"}`}>{t.title}</span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider ${STATUS_COLORS[t.status]}`}>{t.status.replace("_", " ")}</span>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                    </div>
                    {t.description && <p className="text-sm font-semibold text-slate-500 mb-4 line-clamp-2 leading-relaxed">{t.description}</p>}
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                      {t.dueDate && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Due {new Date(t.dueDate).toLocaleDateString()}</span>}
                      <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-slate-400" /> {t.assignedTo ? <span className="text-[#000223] bg-slate-100 px-2 py-0.5 rounded-md">{t.assignedTo.name}</span> : "Unassigned"}</span>
                      {t.inquiry && <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md border border-amber-100">Related Inquiry: {t.inquiry.name}</span>}
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(t)} className="text-slate-400 hover:text-blue-600 p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteTask(t.id)} className="text-slate-400 hover:text-red-600 p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000223]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] scale-in-95 animate-in duration-200">
              <div className="px-6 sm:px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <h2 className="font-black text-2xl text-[#000223]">{editingTask ? "Edit Task" : "Create Task"}</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"><XCircle className="w-6 h-6"/></button>
              </div>
              
              <form onSubmit={handleSave} className="overflow-y-auto p-6 sm:p-8 flex-1 space-y-6">
                <div>
                  <label className="label-premium">Title</label>
                  <input required value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className="input-premium" placeholder="E.g. Call customer back" />
                </div>
                
                <div>
                  <label className="label-premium">Description</label>
                  <textarea value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="input-premium min-h-[120px] resize-y" placeholder="Add context..." />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="label-premium">Status</label>
                    <select value={formData.status} onChange={e=>setFormData({...formData, status:e.target.value})} className="input-premium cursor-pointer">
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                      <option value="BLOCKED">Blocked</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-premium">Priority</label>
                    <select value={formData.priority} onChange={e=>setFormData({...formData, priority:e.target.value})} className="input-premium cursor-pointer">
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="label-premium">Assign To</label>
                    <select value={formData.assignedToId} onChange={e=>setFormData({...formData, assignedToId:e.target.value})} className="input-premium cursor-pointer">
                      <option value="">Unassigned</option>
                      {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-premium">Due Date</label>
                    <input type="date" value={formData.dueDate} onChange={e=>setFormData({...formData, dueDate:e.target.value})} className="input-premium" />
                  </div>
                </div>
              </form>
              
              <div className="px-6 sm:px-8 py-5 bg-[#FAF6EF] border-t border-slate-100 flex justify-end gap-3 rounded-b-3xl">
                <button type="button" onClick={() => setShowModal(false)} className="btn-premium-secondary">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-premium-primary flex items-center gap-2">
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} Save Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
