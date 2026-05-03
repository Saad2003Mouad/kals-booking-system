import Link from "next/link";
import { Eye } from "lucide-react";

// Mock data for Phase 1 UI
const mockBookings = [
  { id: 'KB-1001', customer: 'John Doe', date: '2026-06-15', status: 'CONFIRMED', vehicle: 'Classic Truck', total: 350 },
  { id: 'KB-1002', customer: 'Jane Smith', date: '2026-06-18', status: 'PENDING', vehicle: 'Van Express', total: 300 },
  { id: 'KB-1003', customer: 'Acme Corp', date: '2026-07-02', status: 'COMPLETED', vehicle: 'Premium Truck', total: 600 },
];

export default function AdminBookingsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bookings</h2>
        <button className="btn-primary py-2 px-4 text-sm">Add Booking</button>
      </div>

      <div className="card-premium overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 font-medium text-slate-500">ID</th>
              <th className="px-6 py-4 font-medium text-slate-500">Customer</th>
              <th className="px-6 py-4 font-medium text-slate-500">Date</th>
              <th className="px-6 py-4 font-medium text-slate-500">Vehicle</th>
              <th className="px-6 py-4 font-medium text-slate-500">Total</th>
              <th className="px-6 py-4 font-medium text-slate-500">Status</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockBookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-primary-600">{b.id}</td>
                <td className="px-6 py-4">{b.customer}</td>
                <td className="px-6 py-4 text-slate-600">{b.date}</td>
                <td className="px-6 py-4 text-slate-600">{b.vehicle}</td>
                <td className="px-6 py-4 font-medium">${b.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    b.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/bookings/${b.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                    <Eye className="w-4 h-4" /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
