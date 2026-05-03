import Link from "next/link";
import { ChevronLeft, User, MapPin, CalendarClock, DollarSign, Truck } from "lucide-react";

export default function AdminBookingDetailPage({ params }: { params: { id: string } }) {
  // Mock Data for Phase 1 UI
  const booking = {
    id: params.id,
    customer: { name: 'John Doe', email: 'john@example.com', phone: '555-0123' },
    event: { date: '2026-06-15', time: '14:00', duration: 45, guests: 65, address: '123 Main St, Boston, MA 02151' },
    status: 'PENDING',
    vehicle: 'Not Assigned',
    quote: { basePrice: 250, guestFee: 30, travelFee: 0, overtimeFee: 0, total: 280 }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6 font-medium">
        <ChevronLeft className="w-4 h-4" /> Back to Bookings
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          Booking {booking.id}
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-bold uppercase tracking-wide">
            {booking.status}
          </span>
        </h2>
        <div className="flex gap-3">
          <button className="btn-secondary py-2 px-4 text-sm text-red-600 border-red-200 hover:bg-red-50">Cancel</button>
          <button className="btn-primary py-2 px-4 text-sm bg-green-600 hover:bg-green-700">Confirm Booking</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><User className="w-5 h-5 text-primary-500" /> Customer Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-medium">{booking.customer.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Email:</span> <span className="font-medium">{booking.customer.email}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Phone:</span> <span className="font-medium">{booking.customer.phone}</span></div>
          </div>
        </div>

        {/* Event Info */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CalendarClock className="w-5 h-5 text-primary-500" /> Event Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Date:</span> <span className="font-medium">{booking.event.date}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Time:</span> <span className="font-medium">{booking.event.time}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Duration:</span> <span className="font-medium">{booking.event.duration} mins</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Guests:</span> <span className="font-medium">{booking.event.guests}</span></div>
          </div>
        </div>

        {/* Location Info */}
        <div className="card-premium p-6 md:col-span-2">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-500" /> Location</h3>
          <p className="text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">{booking.event.address}</p>
        </div>

        {/* Pricing Info */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary-500" /> Pricing Breakdown</h3>
          <div className="space-y-3 text-sm pb-4 border-b border-slate-100 mb-4">
            <div className="flex justify-between"><span className="text-slate-500">Base Price:</span> <span className="font-medium">${booking.quote.basePrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Extra Guests Fee:</span> <span className="font-medium">${booking.quote.guestFee.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Travel Fee:</span> <span className="font-medium">${booking.quote.travelFee.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Overtime Fee:</span> <span className="font-medium">${booking.quote.overtimeFee.toFixed(2)}</span></div>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="text-primary-600">${booking.quote.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Dispatch Actions */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-primary-500" /> Dispatch Assignment</h3>
          <div className="space-y-4">
            <div>
              <label className="label-premium">Assign Vehicle</label>
              <select className="input-premium py-2">
                <option value="">Unassigned</option>
                <option value="t1">Classic Truck 1</option>
                <option value="t2">Classic Truck 2</option>
                <option value="v1">Sprinter Van</option>
              </select>
            </div>
            <div>
              <label className="label-premium">Assign Driver</label>
              <select className="input-premium py-2">
                <option value="">Unassigned</option>
                <option value="d1">Kal</option>
                <option value="d2">Mike</option>
              </select>
            </div>
            <button className="btn-primary w-full py-2">Save Assignment</button>
          </div>
        </div>
      </div>
    </div>
  );
}
