import Link from "next/link";
import { LayoutDashboard, Calendar, Users, Settings, Truck } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight">Kals Admin</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 text-white transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/bookings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <Calendar className="w-5 h-5" /> Bookings
          </Link>
          <Link href="/admin/vehicles" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <Truck className="w-5 h-5" /> Vehicles
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <Users className="w-5 h-5" /> Customers
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">A</div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
