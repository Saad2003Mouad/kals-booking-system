"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  CalendarDays, Truck, ArrowRight, AlertCircle, TrendingUp, 
  DollarSign, Users, CheckCircle2, Activity, ClipboardList, Inbox, Plus
} from "lucide-react";

const AreaChart    = dynamic(()=>import("recharts").then(m=>m.AreaChart),     {ssr:false});
const Area         = dynamic(()=>import("recharts").then(m=>m.Area),          {ssr:false});
const XAxis        = dynamic(()=>import("recharts").then(m=>m.XAxis),         {ssr:false});
const YAxis        = dynamic(()=>import("recharts").then(m=>m.YAxis),         {ssr:false});
const CartesianGrid= dynamic(()=>import("recharts").then(m=>m.CartesianGrid), {ssr:false});
const Tooltip      = dynamic(()=>import("recharts").then(m=>m.Tooltip),       {ssr:false});
const ResponsiveContainer = dynamic(()=>import("recharts").then(m=>m.ResponsiveContainer),{ssr:false});

type DashData = {
  stats:{ todayJobs:number; pending:number; weekRevenue:number; monthRevenue:number; completedMonth:number; totalCustomers:number };
  todayBookings:{ bookingNumber:string; startTime:string; customer:{firstName:string;lastName:string}; eventType:string; city:string; vehicle:{code:string}|null; status:string }[];
  pendingBookings:{ id:string; bookingNumber:string; customer:{firstName:string;lastName:string}; eventType:string; totalAmount:number }[];
  vehicles:{ code:string; type:string; status:string }[];
  revenueChart:{ day:string; revenue:number }[];
};

const STATUS_COLOR:Record<string,string> = {
  CONFIRMED:"bg-emerald-50 text-emerald-600 border border-emerald-200", 
  PENDING:"bg-amber-50 text-amber-600 border border-amber-200",
  ASSIGNED:"bg-blue-50 text-blue-600 border border-blue-200", 
  IN_PROGRESS:"bg-purple-50 text-purple-600 border border-purple-200",
  COMPLETED:"bg-slate-50 text-slate-600 border border-slate-200", 
  CANCELLED:"bg-red-50 text-red-600 border border-red-200",
};

const VEHICLE_COLOR:Record<string,{bg:string;text:string}> = {
  AVAILABLE:{bg:"bg-emerald-50 border border-emerald-200",text:"text-emerald-600"},
  ON_JOB:{bg:"bg-blue-50 border border-blue-200",text:"text-blue-600"},
  MAINTENANCE:{bg:"bg-red-50 border border-red-200",text:"text-red-600"},
};

function StatCard({label,value,icon:Icon,trend,href,bgClass,iconColor}:{label:string;value:string|number;icon:any;trend?:string;href:string;bgClass:string;iconColor:string}) {
  return (
    <Link href={href} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md hover:border-[#FFA000]/30 transition-all group flex flex-col justify-between h-full relative overflow-hidden">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${bgClass} blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500`} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} bg-opacity-10 text-opacity-100 shadow-sm border border-white`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
            <TrendingUp className="w-3 h-3" /> {trend}
          </span>
        )}
      </div>
      <div className="relative z-10">
        <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">{value}</h3>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [data, setData]       = useState<DashData|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
        const text = await res.text();

        let json;
        try {
          json = text ? JSON.parse(text) : null;
        } catch (e) {
          // Parsing failed
        }

        if (!res.ok) {
          throw new Error(
            json?.error || `Dashboard API failed with status ${res.status}`
          );
        }

        if (!json) {
          throw new Error("Dashboard API returned empty response");
        }

        if (json.success === false) {
          throw new Error(json.error || "Failed to load dashboard data");
        }

        setData(json.data || json);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if(loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-end mb-8">
        <div><div className="h-8 w-64 bg-slate-200 rounded-lg mb-2"></div><div className="h-4 w-40 bg-slate-100 rounded-lg"></div></div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {[...Array(6)].map((_,i)=><div key={i} className="h-36 bg-white rounded-2xl border border-slate-100 shadow-sm"></div>)}
      </div>
      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 h-[400px] bg-white rounded-2xl border border-slate-100 shadow-sm"></div>
        <div className="h-[400px] bg-white rounded-2xl border border-slate-100 shadow-sm"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Dashboard Error</h2>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if(!data) return null;
  const { stats, todayBookings, pendingBookings, vehicles, revenueChart } = data;

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {new Date().getHours()<12?"Good morning":"Good afternoon"}, Admin
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Here's what's happening with Boston Legend today.
          </p>
        </div>
        <Link href="/booking" target="_blank" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#020617] text-white hover:bg-[#FFA000] hover:text-[#020617] font-bold text-sm shadow-md transition-all">
          <Plus className="w-4 h-4" /> New Booking
        </Link>
      </div>

      {/* KPI Row (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <StatCard label="Total Bookings"  value={stats.completedMonth + stats.pending} icon={CalendarDays} href="/admin/bookings" bgClass="bg-blue-500" iconColor="text-blue-600" trend="+12%" />
        <StatCard label="Revenue (M)"     value={`$${(stats.monthRevenue/1000).toFixed(1)}k`} icon={DollarSign} href="/admin/bookings" bgClass="bg-emerald-500" iconColor="text-emerald-600" trend="+8%" />
        <StatCard label="Customers"       value={stats.totalCustomers} icon={Users} href="/admin/customers" bgClass="bg-purple-500" iconColor="text-purple-600" />
        <StatCard label="Pending Apps"    value={stats.pending} icon={AlertCircle} href="/admin/bookings?status=PENDING" bgClass="bg-amber-500" iconColor="text-amber-600" />
        <StatCard label="Active Fleet"    value={vehicles.filter(v=>v.status==="ON_JOB").length} icon={Truck} href="/admin/vehicles" bgClass="bg-[#FFA000]" iconColor="text-[#FFA000]" />
        <StatCard label="New Inquiries"   value="0" icon={Inbox} href="/admin/inquiries" bgClass="bg-rose-500" iconColor="text-rose-600" />
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        
        {/* Left Column (Main Charts & Tables) */}
        <div className="xl:col-span-2 space-y-6">

          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-bold text-lg text-slate-800">Revenue Overview</h2>
                <p className="text-sm font-medium text-slate-500">Last 7 days performance</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-800">${stats.weekRevenue.toFixed(0)}</span>
                <div className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1"><TrendingUp className="w-3 h-3"/> +4.5%</div>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChart} margin={{top:10,right:0,left:-20,bottom:0}}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"  stopColor="#FFA000" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#FFA000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0"/>
                  <XAxis dataKey="day" tick={{fontSize:12,fontWeight:600,fill:"#64748B"}} axisLine={false} tickLine={false} dy={10}/>
                  <YAxis tick={{fontSize:12,fontWeight:600,fill:"#64748B"}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
                  <Tooltip 
                    formatter={(v:any)=>[`$${Number(v).toFixed(2)}`,"Revenue"]} 
                    contentStyle={{borderRadius:12,border:"none",boxShadow:"0 10px 25px rgba(0,0,0,0.1)",fontWeight:"bold"}}
                    itemStyle={{color:"#020617"}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#FFA000" strokeWidth={3} fill="url(#revGrad)" activeDot={{r:6, fill:"#020617", stroke:"#FFA000", strokeWidth:3}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Today's Schedule Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-500"/> Today's Operations
              </h2>
              <Link href="/admin/bookings" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                View All <ArrowRight className="w-4 h-4"/>
              </Link>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              {todayBookings.length === 0 ? (
                <div className="px-6 py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarDays className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-1">Clear Schedule</h3>
                  <p className="text-slate-500 font-medium text-sm">No events booked for today.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Client & Event</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Vehicle</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {todayBookings.map(b=>(
                      <tr key={b.bookingNumber} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-700">{b.startTime}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{b.customer.firstName} {b.customer.lastName}</div>
                          <div className="text-xs text-slate-500 font-medium mt-0.5">{b.eventType} · {b.city}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {b.vehicle ? (
                            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                              {b.vehicle.code.startsWith("VAN")?"🚐":"🚌"} {b.vehicle.code}
                            </span>
                          ) : (
                            <span className="text-sm font-medium text-slate-400">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-black tracking-wide ${STATUS_COLOR[b.status]??"bg-slate-100 text-slate-600"}`}>
                            {b.status.replace("_"," ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Side Panels) */}
        <div className="space-y-6">
          
          {/* Action Required / Pending */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500"/> Action Required
                {pendingBookings.length > 0 && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">{pendingBookings.length}</span>
                )}
              </h2>
            </div>
            
            {pendingBookings.length === 0 ? (
              <div className="p-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-600">All caught up!</p>
                <p className="text-xs text-slate-400 mt-1">No pending approvals needed.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 max-h-[350px] overflow-y-auto">
                {pendingBookings.slice(0, 5).map(b=>(
                  <div key={b.id} className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 flex items-center justify-center font-black text-amber-800 text-sm flex-shrink-0">
                      {b.customer.firstName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 truncate">{b.customer.firstName} {b.customer.lastName}</div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5 truncate">{b.eventType} · <span className="text-amber-600 font-bold">${b.totalAmount.toFixed(2)}</span></div>
                    </div>
                    <Link href={`/admin/bookings/${b.id}`} className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#FFA000] hover:border-[#FFA000] hover:bg-[#FFA000]/10 transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
                {pendingBookings.length > 5 && (
                  <Link href="/admin/bookings?status=PENDING" className="block p-4 text-center text-sm font-bold text-amber-600 hover:bg-amber-50 transition-colors">
                    View {pendingBookings.length - 5} more
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Fleet Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2"><Truck className="w-4 h-4 text-slate-400"/> Fleet Status</h3>
              <Link href="/admin/vehicles" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">Manage</Link>
            </div>
            <div className="p-2">
              {vehicles.map(v=>{
                const c = VEHICLE_COLOR[v.status]??{bg:"bg-slate-100 text-slate-600",text:""};
                return (
                  <div key={v.code} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">
                        {v.code.startsWith("VAN")?"🚐":"🚌"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 leading-tight">{v.code}</div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">{v.type}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
                      {v.status.replace("_"," ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
