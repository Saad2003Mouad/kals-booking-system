export type PortalType = "public" | "customer" | "admin";

export interface NavLink {
  label: string;
  href: string;
  isButton?: boolean;
}

export const navConfig: Record<PortalType, NavLink[]> = {
  public: [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "Occasions", href: "/occasions" },
    { label: "Packages", href: "/packages" },
    { label: "Manage Booking", href: "/manage-booking" },
    { label: "Contact", href: "/contact-us" },
  ],
  customer: [
    { label: "My Booking", href: "/customer/booking" }, // Usually suffixed with ID dynamically
    { label: "Packages", href: "/packages" },
    { label: "Contact Support", href: "/contact-us" }
  ],
  admin: [
    { label: "Dashboard", href: "/admin" },
    { label: "Reservations", href: "/admin/bookings" },
    { label: "Fleet", href: "/admin/fleet" },
    { label: "Customers", href: "/admin/customers" },
    { label: "Settings", href: "/admin/settings" }
  ]
};
