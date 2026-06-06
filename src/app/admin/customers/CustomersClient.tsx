"use client";

import { useState } from "react";
import { 
  Search, Mail, Phone, CalendarDays, DollarSign, 
  User, ArrowRight, X, Calendar, MapPin, ClipboardList, ShieldAlert
} from "lucide-react";

type BookingWithQuote = {
  id: string;
  bookingNumber: string;
  status: string;
  eventDate: Date;
  startTime: string;
  totalAmount: number;
  notes: string | null;
  quote: {
    totalAmount: number;
  } | null;
};

type CustomerWithBookings = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  createdAt: Date;
  bookings: BookingWithQuote[];
};

export default function CustomersClient({ initialCustomers }: { initialCustomers: CustomerWithBookings[] }) {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithBookings | null>(null);

  const filtered = initialCustomers.filter(c =>
    `${c.firstName} ${c.lastName} ${c.email || ""} ${c.phone || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpent = initialCustomers.reduce((sum, c) => 
    sum + c.bookings.reduce((s, b) => s + (b.quote?.totalAmount ?? b.totalAmount ?? 0), 0), 0
  );

  const repeatCustomersCount = initialCustomers.filter(c => c.bookings.length > 1).length;

  return (
    <div className="space-y-8 pb-12" style={{ fontFamily: "'Inter', 'Nunito', sans-serif" }}>
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFA000]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Backoffice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#000223]">Customer Directory</h1>
          <p className="text-slate-500 font-semibold mt-1 text-sm">Manage {initialCustomers.length} premium client profiles and history</p>
        </div>
        <a 
          href="/api/admin/export?type=customers"
          download
          className="px-5 py-2.5 rounded-xl text-sm font-black text-slate-600 bg-white border border-slate-200 shadow-sm hover:border-[#FFA000] hover:text-[#000223] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
        >
          Export CSV
        </a>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#000223] to-[#0a0f4a] rounded-2xl border border-white/5 shadow-xl p-6 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#FFA000]/10 rounded-full blur-2xl group-hover:bg-[#FFA000]/20 transition-all duration-500" />
          <div className="text-3xl sm:text-4xl font-black text-[#FFA000] mb-1 tracking-tight">{initialCustomers.length}</div>
          <div className="text-xs text-slate-350 font-black uppercase tracking-widest">Total Clients</div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500" />
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 mb-1 tracking-tight">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
          <div className="text-xs text-slate-400 font-black uppercase tracking-widest">Lifetime Value (LTV)</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-500" />
          <div className="text-3xl sm:text-4xl font-black text-[#000223] mb-1 tracking-tight">
            {initialCustomers.length > 0 ? ((repeatCustomersCount / initialCustomers.length) * 100).toFixed(0) : 0}%
          </div>
          <div className="text-xs text-slate-400 font-black uppercase tracking-widest">Repeat Rate ({repeatCustomersCount} clients)</div>
        </div>
      </div>

      {/* Filter / Search section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients by name, email, or phone..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 transition-all bg-[#FAF8F0]/30 placeholder:text-slate-400 text-[#000223] text-[16px]" 
          />
        </div>
      </div>

      {/* Grid List */}
      {filtered.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-black text-[#000223]">No customers match your query</h3>
          <p className="text-sm font-semibold text-slate-500 mt-1 max-w-xs mx-auto">Double check spelling or add a new customer from bookings</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map(c => {
            const spent = c.bookings.reduce((s, b) => s + (b.quote?.totalAmount ?? b.totalAmount ?? 0), 0);
            return (
              <div 
                key={c.id} 
                onClick={() => setSelectedCustomer(c)}
                className="bg-white rounded-2xl border border-slate-200/85 hover:border-[#FFA000] shadow-sm hover:shadow-md transition-all p-6 flex gap-5 cursor-pointer group hover:-translate-y-0.5"
              >
                <div className="w-14 h-14 rounded-xl bg-[#000223] border border-white/5 flex items-center justify-center font-black text-[#FFA000] text-lg shrink-0 shadow-sm">
                  {c.firstName.charAt(0).toUpperCase()}{c.lastName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-lg text-[#000223] truncate group-hover:text-[#FFA000] transition-colors">
                        {c.firstName} {c.lastName}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mt-0.5">
                        Client since {new Date(c.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#FFA000] group-hover:bg-[#000223] transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs font-semibold text-slate-500">
                    {c.email && (
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-350"/> {c.email}</span>
                    )}
                    {c.phone && (
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-350"/> {c.phone}</span>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="bg-[#FAF8F0]/40 rounded-xl p-3 border border-slate-100">
                      <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                        <CalendarDays className="w-3 h-3 text-[#FFA000]"/> Bookings
                      </div>
                      <div className="font-black text-[#000223] text-sm">{c.bookings.length} Events</div>
                    </div>
                    <div className="bg-[#FAF8F0]/40 rounded-xl p-3 border border-slate-100">
                      <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-500"/> Total Spend
                      </div>
                      <div className="font-black text-[#000223] text-sm">${spent.toFixed(0)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customer details slide-over drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden print:hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Overlay */}
            <div 
              onClick={() => setSelectedCustomer(null)}
              className="absolute inset-0 bg-[#000223]/50 backdrop-blur-sm transition-opacity" 
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform bg-[#FAF8F0] border-l border-slate-200 shadow-2xl transition-all duration-300 sm:duration-500 translate-x-0">
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  {/* Drawer Header */}
                  <div className="px-6 py-6 bg-[#000223] border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FFA000] flex items-center justify-center font-black text-[#000223] text-base">
                        {selectedCustomer.firstName.charAt(0).toUpperCase()}{selectedCustomer.lastName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-white leading-tight" id="slide-over-title">
                          {selectedCustomer.firstName} {selectedCustomer.lastName}
                        </h2>
                        <p className="text-[10px] text-slate-350 font-bold uppercase tracking-wider mt-0.5">Client Details</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedCustomer(null)}
                      className="rounded-xl p-2 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <X className="h-5.5 w-5.5" />
                    </button>
                  </div>

                  {/* Drawer Content */}
                  <div className="flex-1 p-6 space-y-8">
                    
                    {/* Section: Contact Info */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Information</h3>
                      <div className="bg-[#FAF8F0]/40 rounded-2xl border border-slate-200/80 p-5 space-y-4 font-semibold text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Email</span>
                          {selectedCustomer.email ? (
                            <a href={`mailto:${selectedCustomer.email}`} className="text-[#000223] hover:text-[#FFA000] font-black underline truncate max-w-[200px]">{selectedCustomer.email}</a>
                          ) : (
                            <span className="text-slate-400 italic font-medium">None</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Phone</span>
                          {selectedCustomer.phone ? (
                            <a href={`tel:${selectedCustomer.phone}`} className="text-[#000223] hover:text-[#FFA000] font-black">{selectedCustomer.phone}</a>
                          ) : (
                            <span className="text-slate-400 italic font-medium">None</span>
                          )}
                        </div>
                        <div className="flex justify-between items-start">
                          <span className="text-slate-400 shrink-0">Address</span>
                          <span className="text-[#000223] font-black text-right">
                            {selectedCustomer.address ? (
                              <>{selectedCustomer.address}<br />{selectedCustomer.city}, MA {selectedCustomer.zip}</>
                            ) : (
                              <span className="text-slate-400 italic font-medium">None</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section: Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#FAF8F0]/40 rounded-xl p-4 border border-slate-200/85">
                        <div className="text-[10px] font-black uppercase text-slate-450 tracking-wider mb-1">Total Bookings</div>
                        <div className="text-2xl font-black text-[#000223]">{selectedCustomer.bookings.length}</div>
                      </div>
                      <div className="bg-[#FAF8F0]/40 rounded-xl p-4 border border-slate-200/85">
                        <div className="text-[10px] font-black uppercase text-slate-450 tracking-wider mb-1">Lifetime Spent</div>
                        <div className="text-2xl font-black text-emerald-600">
                          ${selectedCustomer.bookings.reduce((s, b) => s + (b.quote?.totalAmount ?? b.totalAmount ?? 0), 0).toFixed(0)}
                        </div>
                      </div>
                    </div>

                    {/* Section: Booking History */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#FFA000]" /> Booking History
                      </h3>
                      
                      {selectedCustomer.bookings.length === 0 ? (
                        <p className="text-xs text-slate-400 italic font-semibold pl-2">No bookings recorded for this client.</p>
                      ) : (
                        <div className="space-y-4">
                          {selectedCustomer.bookings.map(b => {
                            const date = new Date(b.eventDate + "T12:00:00").toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric'
                            });
                            return (
                              <div key={b.id} className="relative pl-6 pb-2 border-l border-slate-200/80 last:border-0 last:pb-0">
                                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#FFA000] border-2 border-white shadow-sm" />
                                <div className="bg-[#FAF8F0]/30 rounded-xl border border-slate-200/80 p-4 hover:border-slate-300 transition-all">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-mono text-xs font-black text-[#000223]">#{b.bookingNumber}</span>
                                    <span className="text-sm font-black text-[#FFA000]">${(b.quote?.totalAmount ?? b.totalAmount ?? 0).toFixed(0)}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
                                    <span>{date} at {b.startTime}</span>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide ${
                                      b.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-650 border border-emerald-100" :
                                      b.status === "PENDING_REVIEW" ? "bg-amber-50 text-amber-650 border border-amber-100" :
                                      "bg-slate-50 text-slate-600 border border-slate-100"
                                    }`}>
                                      {b.status.replace("_", " ")}
                                    </span>
                                  </div>
                                  {b.notes && (
                                    <div className="mt-2 text-xs font-semibold text-slate-550 italic border-t border-slate-200/40 pt-2">
                                      "{b.notes}"
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
