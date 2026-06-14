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
    <div className="p-4 sm:p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-[#FFA000]" />
            Business Calendar
          </h1>
          <p className="text-slate-500 mt-2 font-medium">View all confirmed and pending events across the organization.</p>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 relative z-0">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  {selectedEvent.title}
                </h3>
                <span className="inline-block mt-2 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">
                  {selectedEvent.extendedProps.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="w-5 h-5 text-[#FFA000] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Event Time</p>
                  <p className="text-sm text-slate-600">
                    {selectedEvent.start?.toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                    {" – "}
                    {selectedEvent.end?.toLocaleTimeString([], { timeStyle: "short" })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#FFA000] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Location</p>
                  <p className="text-sm text-slate-600">{selectedEvent.extendedProps.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-[#FFA000] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Customer</p>
                  <p className="text-sm text-slate-600">{selectedEvent.extendedProps.customerName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#FFA000] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Phone</p>
                  <p className="text-sm text-slate-600">{selectedEvent.extendedProps.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#FFA000] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">Email</p>
                  <p className="text-sm text-slate-600">{selectedEvent.extendedProps.email}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
              >
                Close
              </button>
              <Link
                href={`/admin/bookings/${selectedEvent.id}`}
                className="px-4 py-2.5 text-sm font-bold text-[#000223] bg-[#FFA000] hover:bg-[#e69000] rounded-xl transition-colors shadow-sm"
              >
                View Full Booking
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
