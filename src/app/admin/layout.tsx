"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, Calendar, Users, Settings, Truck,
  UserCircle, Package, ClipboardList, MessageSquare,
  Inbox, LogOut, Bell, Search, Menu, X, ChevronRight,
  CheckCircle, AlertTriangle, Clock, ChevronDown, MapPin
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

type NavItem = { href: string; label: string; icon: any };
type NavGroup = { title: string; items: NavItem[] };

function isRouteAllowed(role: string, href: string): boolean {
  if (role === "OWNER") return true;
  if (role === "ADMIN") {
    return href !== "/admin/users";
  }
  if (role === "DISPATCHER") {
    return [
      "/admin",
      "/admin/calendar",
      "/admin/bookings",
      "/admin/tasks",
      "/admin/customers",
      "/admin/inquiries",
      "/admin/vehicles",
    ].includes(href);
  }
  if (role === "SUPPORT") {
    return [
      "/admin",
      "/admin/calendar",
      "/admin/bookings",
      "/admin/customers",
      "/admin/inquiries",
    ].includes(href);
  }
  if (role === "VIEWER") {
    return [
      "/admin",
      "/admin/calendar",
      "/admin/bookings",
      "/admin/customers",
      "/admin/packages",
    ].includes(href);
  }
  if (role === "DRIVER") {
    return [
      "/admin",
    ].includes(href);
  }
  return false;
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Operations",
    items: [
      { href: "/admin",            label: "Dashboard",    icon: LayoutDashboard },
      { href: "/admin/calendar",   label: "Calendar",     icon: Calendar },
      { href: "/admin/bookings",   label: "Bookings",     icon: ClipboardList },
      { href: "/admin/tasks",      label: "Tasks",        icon: ClipboardList },
    ]
  },
  {
    title: "CRM & Support",
    items: [
      { href: "/admin/customers",  label: "Customers",    icon: Users },
      { href: "/admin/inquiries",  label: "Inquiries",    icon: Inbox },
      { href: "/admin/ai",         label: "AI Concierge", icon: MessageSquare },
    ]
  },
  {
    title: "Fleet",
    items: [
      { href: "/admin/vehicles",   label: "Fleet",        icon: Truck },
    ]
  },
  {
    title: "System",
    items: [
      { href: "/admin/packages",       label: "Packages",       icon: Package },
      { href: "/admin/service-areas",  label: "Service Areas",  icon: MapPin },
      { href: "/admin/users",          label: "Staff & Roles",  icon: Users },
      { href: "/admin/settings",       label: "Settings",       icon: Settings },
    ]
  }
];

type Notification = {
  id: string;
  title: string;
  body: string;
  type: "info" | "warning" | "success";
  time: string;
  read: boolean;
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "DRIVER";
  const userName = session?.user?.name || session?.user?.email || "Staff Member";
  const userInitials = userName.substring(0, 1).toUpperCase();

  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  // Fetch real notifications (pending bookings + new inquiries)
  useEffect(() => {
    async function loadNotifications() {
      try {
        const [bRes, iRes] = await Promise.all([
          fetch("/api/admin/bookings?status=PENDING_REVIEW"),
          fetch("/api/admin/inquiries?status=NEW"),
        ]);
        const bData = bRes.ok ? await bRes.json() : { data: [] };
        const iData = iRes.ok ? await iRes.json() : { data: [] };

        const items: Notification[] = [];
        (bData.data || []).slice(0, 5).forEach((b: any) => {
          items.push({
            id: `b-${b.id}`,
            title: "New Booking Pending Review",
            body: `${b.customer?.firstName} ${b.customer?.lastName} — ${b.eventType}`,
            type: "warning",
            time: new Date(b.createdAt).toLocaleDateString(),
            read: false,
          });
        });
        (iData.data || []).slice(0, 3).forEach((i: any) => {
          items.push({
            id: `i-${i.id}`,
            title: "New Inquiry",
            body: `${i.name}: ${(i.notes || "").substring(0, 60)}...`,
            type: "info",
            time: new Date(i.createdAt).toLocaleDateString(),
            read: false,
          });
        });
        setNotifications(items);
        setUnreadCount(items.length);
      } catch {}
    }
    loadNotifications();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = () => {
    setNotifications(n => n.map(x => ({ ...x, read: true })));
    setUnreadCount(0);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/admin/bookings?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── MOBILE OVERLAY ── */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`} 
        style={{ 
          background: "linear-gradient(180deg, #020617 0%, #0F172A 100%)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.1)"
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif"
            alt="Boston Legend"
            style={{ height: "36px", width: "auto", filter: "brightness(0) invert(1)" }}
          />
          <button className="md:hidden text-white/50 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="px-6 py-6 border-b border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FFA000] to-[#FFD000] p-0.5 shadow-[0_0_15px_rgba(255,160,0,0.3)] flex-shrink-0">
            <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center border-2 border-transparent">
              <span className="text-[#FFA000] font-bold text-lg">{userInitials}</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-white font-semibold text-sm truncate">{userName}</div>
            <div className="text-emerald-400 text-xs font-semibold uppercase mt-0.5 tracking-wider">{userRole}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide space-y-6">
          {NAV_GROUPS.map((group, i) => {
            const visibleItems = group.items.filter(item => isRouteAllowed(userRole, item.href));
            if (visibleItems.length === 0) return null;
            return (
              <div key={i} className="space-y-1">
                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 px-4">{group.title}</div>
                {visibleItems.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                        active 
                          ? "bg-gradient-to-r from-[#FFA000]/20 to-transparent text-[#FFA000] border-l-2 border-[#FFA000]" 
                          : "text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? "text-[#FFA000]" : "text-white/40 group-hover:text-white/80"}`} />
                        {label}
                      </div>
                      {active && <ChevronRight className="w-4 h-4 text-[#FFA000]/50" />}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="px-6 py-6 border-t border-white/10 bg-black/20">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Bar */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-8 border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
          
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-800">
                {NAV_GROUPS.flatMap(g => g.items).find(n => isActive(n.href))?.label ?? "Dashboard"}
              </h1>
              {isActive("/admin") && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> System Healthy
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Global Search — navigates to /admin/bookings?search=... on Enter */}
            <div className="hidden lg:flex items-center relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 group-focus-within:text-[#FFA000] transition-colors" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search bookings, customers..."
                className="w-72 bg-slate-50 border border-slate-200 text-sm font-medium rounded-full pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 transition-all placeholder:text-slate-400"
              />
              <div className="absolute right-3 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400 border border-slate-200">↵</div>
            </div>

            <div className="w-px h-8 bg-slate-200 hidden sm:block" />

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                className="relative p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[9px] font-black text-white flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <span className="font-black text-[#000223] text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs font-bold text-[#FFA000] hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center text-sm font-semibold text-slate-400">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`px-5 py-3.5 flex gap-3 hover:bg-slate-50 transition-colors ${!n.read ? "bg-amber-50/40" : ""}`}>
                          <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            n.type === "warning" ? "bg-amber-100" : n.type === "success" ? "bg-emerald-100" : "bg-blue-100"
                          }`}>
                            {n.type === "warning" 
                              ? <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              : n.type === "success"
                              ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                              : <Clock className="w-3.5 h-3.5 text-blue-600" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-[#000223]">{n.title}</div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5 truncate">{n.body}</div>
                            <div className="text-[10px] text-slate-400 font-semibold mt-1">{n.time}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-5 py-3 border-t border-slate-100">
                    <Link href="/admin/bookings?status=PENDING_REVIEW" onClick={() => setShowNotifications(false)} className="text-xs font-bold text-[#FFA000] hover:underline">
                      View all pending bookings →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={userRef}>
              <button 
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 rounded-xl px-2 py-1.5 transition-colors"
              >
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-bold text-slate-800">{userName}</div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{userRole}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm">
                  <span className="text-slate-700 font-bold">{userInitials}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <div className="font-black text-sm text-[#000223] truncate">{userName}</div>
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{userRole}</div>
                  </div>
                  <div className="py-2">
                    {isRouteAllowed(userRole, "/admin/settings") && (
                      <Link href="/admin/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <Settings className="w-4 h-4 text-slate-400" />
                        Settings
                      </Link>
                    )}
                    {isRouteAllowed(userRole, "/admin/users") && (
                      <Link href="/admin/users" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <Users className="w-4 h-4 text-slate-400" />
                        Staff & Permissions
                      </Link>
                    )}
                  </div>
                  <div className="py-2 border-t border-slate-100">
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] p-4 sm:p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
