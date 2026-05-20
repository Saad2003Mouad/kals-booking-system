import { prisma } from "@/lib/prisma";
import { Search, Mail, Phone, CalendarDays, DollarSign, Star, MoreHorizontal, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      bookings: {
        include: { quote: true },
        orderBy: { eventDate: 'desc' }
      }
    },
    orderBy: { firstName: 'asc' },
    take: 20
  });

  const totalSpent = customers.reduce((sum, c) => sum + c.bookings.reduce((s, b) => s + (b.quote?.totalAmount ?? 0), 0), 0);

  return (
    <div className="space-y-8 pb-10" style={{ fontFamily: "'Inter', 'Nunito', sans-serif" }}>
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "#000223" }}>Customer Directory</h1>
          <p className="text-slate-500 font-semibold mt-1 text-sm">Manage {customers.length} premium client profiles</p>
        </div>
        <a 
          href="/api/admin/export?type=customers"
          download
          className="px-5 py-2.5 rounded-xl text-sm font-black text-slate-600 bg-white border border-slate-200 shadow-sm hover:border-[#FFA000] hover:text-[#000223] transition-all flex items-center gap-2"
        >
          Export CSV
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
          <div className="text-3xl font-black text-[#000223] mb-1">{customers.length}</div>
          <div className="text-sm text-slate-500 font-bold">Total Clients</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
          <div className="text-3xl font-black text-emerald-600 mb-1">${totalSpent.toFixed(0)}</div>
          <div className="text-sm text-slate-500 font-bold">Lifetime Value</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
          <div className="text-3xl font-black text-amber-600 mb-1">{customers.filter(c => c.bookings.length > 1).length}</div>
          <div className="text-sm text-slate-500 font-bold">Repeat Customers</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input placeholder="Search by name or email..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all bg-white" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {customers.map(c => {
            const spent = c.bookings.reduce((s,b)=>s+(b.quote?.totalAmount ?? 0),0);
            return (
              <div key={c.id} className="p-6 hover:bg-slate-50/50 transition-colors group flex gap-5">
                <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[#000223] text-lg shrink-0">
                  {c.firstName.charAt(0)}{c.lastName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-black text-lg text-[#000223] truncate group-hover:text-[#FFA000] transition-colors">{c.firstName} {c.lastName}</h3>
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mt-1">
                        {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1 hover:text-[#000223] transition-colors"><Mail className="w-3 h-3"/> {c.email}</a>}
                        {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1 hover:text-[#000223] transition-colors"><Phone className="w-3 h-3"/> {c.phone}</a>}
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-[#000223] transition-colors"><MoreHorizontal className="w-5 h-5"/></button>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="text-[10px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> Events</div>
                      <div className="font-black text-[#000223] text-sm">{c.bookings.length} Bookings</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="text-[10px] font-black uppercase text-slate-400 mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3"/> Lifetime</div>
                      <div className="font-black text-[#000223] text-sm">${spent.toFixed(0)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
