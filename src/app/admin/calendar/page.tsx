"use client";

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Calendar as CalendarIcon, MapPin, Phone, Mail, User, X } from "lucide-react";
import Link from "next/link";

const FC_STYLES = `
  .fc-theme-standard td, .fc-theme-standard th { border-color: #e2e8f0; }
  .fc-button-primary { background-color: #000223 !important; border-color: #000223 !important; font-weight: bold !important; text-transform: capitalize !important; }
  .fc-button-primary:hover { background-color: #1a1b3a !important; }
  .fc-button-active { background-color: #FFA000 !important; border-color: #FFA000 !important; color: #000223 !important; }
  .fc-event { cursor: pointer; border-radius: 4px; padding: 2px 4px; font-weight: 600; font-size: 0.85em; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: opacity 0.2s; }
  .fc-event:hover { opacity: 0.9; }
  .fc-toolbar-title { font-weight: 900 !important; color: #000223 !important; }
`;

export default function AdminCalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = FC_STYLES;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const fetchEvents = async (fetchInfo: any, successCallback: any, failureCallback: any) => {
    try {
      const { startStr, endStr } = fetchInfo;
      const res = await fetch(`/api/admin/calendar?start=${encodeURIComponent(startStr)}&end=${encodeURIComponent(endStr)}&t=${Date.now()}`, { cache: "no-store" });
      const json = await res.json();
      if (res.ok && json.success) {
        successCallback(json.data);
      } else {
        failureCallback(new Error("Failed to load events"));
      }
    } catch (err) {
      console.error(err);
      failureCallback(err);
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#000223] tracking-tight flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFA000]" />
              Business Calendar
            </h1>
            <p className="text-slate-500 mt-2 font-semibold text-sm sm:text-base">
              View and manage all confirmed and pending events.
            </p>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="card-premium p-4 sm:p-8 relative z-0">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
            }}
            events={fetchEvents}
            eventClick={(info) => {
              setSelectedEvent(info.event);
            }}
            height="auto"
            aspectRatio={1.5}
            slotMinTime="08:00:00"
            slotMaxTime="23:00:00"
          />
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#000223]/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden scale-in-95 animate-in duration-200">
              <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-[#000223] leading-tight">
                    {selectedEvent.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider rounded-lg border border-blue-100">
                      {selectedEvent.extendedProps.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#FFA000]/10 rounded-xl shrink-0">
                    <CalendarIcon className="w-5 h-5 text-[#FFA000]" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-0.5">Event Time</p>
                    <p className="text-base font-bold text-[#000223]">
                      {selectedEvent.start?.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                      {" – "}
                      {selectedEvent.end?.toLocaleTimeString([], { timeStyle: "short" })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#FFA000]/10 rounded-xl shrink-0">
                    <MapPin className="w-5 h-5 text-[#FFA000]" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-0.5">Location</p>
                    <p className="text-base font-bold text-[#000223]">{selectedEvent.extendedProps.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#FFA000]/10 rounded-xl shrink-0">
                    <User className="w-5 h-5 text-[#FFA000]" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-0.5">Customer</p>
                    <p className="text-base font-bold text-[#000223]">{selectedEvent.extendedProps.customerName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-[#FFA000]/10 rounded-xl shrink-0">
                      <Phone className="w-5 h-5 text-[#FFA000]" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-0.5">Phone</p>
                      <p className="text-sm font-bold text-[#000223] truncate">{selectedEvent.extendedProps.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-[#FFA000]/10 rounded-xl shrink-0">
                      <Mail className="w-5 h-5 text-[#FFA000]" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-0.5">Email</p>
                      <p className="text-sm font-bold text-[#000223] truncate">{selectedEvent.extendedProps.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 border-t border-slate-100 bg-[#FAF6EF] flex justify-end gap-3 rounded-b-3xl">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="btn-premium-secondary"
                >
                  Close
                </button>
                <Link
                  href={`/admin/bookings/${selectedEvent.id}`}
                  className="btn-premium-primary"
                >
                  View Full Booking
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
