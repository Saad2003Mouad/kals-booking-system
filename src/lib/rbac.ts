import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export type Permission =
  | "dashboard.view"
  | "dashboard.view.limited"
  | "bookings.view"
  | "bookings.view.assignedOnly"
  | "bookings.create"
  | "bookings.update"
  | "bookings.approve"
  | "bookings.reject"
  | "bookings.assign"
  | "packages.view"
  | "packages.create"
  | "packages.update"
  | "packages.delete"
  | "serviceAreas.view"
  | "serviceAreas.create"
  | "serviceAreas.update"
  | "serviceAreas.delete"
  | "customers.view"
  | "customers.update"
  | "drivers.view"
  | "drivers.assign"
  | "driver.jobs.view"
  | "driver.jobs.updateStatus"
  | "settings.view"
  | "settings.update"
  | "users.view"
  | "users.create"
  | "users.update"
  | "users.delete"
  | "roles.view"
  | "roles.update"
  | "ai.view"
  | "ai.use"
  | "notifications.view"
  | "google.connect";

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  OWNER: [
    "dashboard.view", "bookings.view", "bookings.create", "bookings.update", "bookings.approve", "bookings.reject", "bookings.assign",
    "packages.view", "packages.create", "packages.update", "packages.delete",
    "serviceAreas.view", "serviceAreas.create", "serviceAreas.update", "serviceAreas.delete",
    "customers.view", "customers.update", "drivers.view", "drivers.assign",
    "settings.view", "settings.update", "users.view", "users.create", "users.update", "users.delete",
    "roles.view", "roles.update", "ai.view", "ai.use", "notifications.view",
    "driver.jobs.view", "driver.jobs.updateStatus", "google.connect"
  ],
  ADMIN: [
    "dashboard.view", "bookings.view", "bookings.create", "bookings.update", "bookings.approve", "bookings.reject", "bookings.assign",
    "packages.view", "packages.create", "packages.update",
    "serviceAreas.view", "serviceAreas.create", "serviceAreas.update",
    "customers.view", "customers.update", "drivers.view", "drivers.assign",
    "settings.view", "ai.view", "ai.use", "notifications.view",
    "driver.jobs.view", "driver.jobs.updateStatus", "google.connect"
  ],
  DISPATCHER: [
    "dashboard.view", "bookings.view", "bookings.update", "bookings.assign",
    "drivers.view", "drivers.assign", "customers.view", "notifications.view"
  ],
  DRIVER: [
    "driver.jobs.view", "driver.jobs.updateStatus", "bookings.view.assignedOnly"
  ],
  SUPPORT: [
    "dashboard.view.limited", "bookings.view", "customers.view", "customers.update", "notifications.view"
  ],
  VIEWER: [
    "dashboard.view", "bookings.view", "packages.view", "customers.view"
  ]
};

export function hasPermission(role: string, permission: string, userPermissions?: string[]): boolean {
  if (role === "OWNER") return true;
  if (userPermissions && userPermissions.includes(permission)) return true;

  const perms = ROLE_PERMISSIONS[role] || [];
  if (perms.includes(permission as Permission)) return true;

  // Legacy compatibility mappings
  if (permission === "manage_bookings") {
    return perms.includes("bookings.view") || perms.includes("bookings.update");
  }
  if (permission === "manage_drivers") {
    return perms.includes("drivers.view") || perms.includes("drivers.assign");
  }
  if (permission === "manage_inquiries") {
    return perms.includes("bookings.view") || perms.includes("customers.view") || perms.includes("dashboard.view.limited");
  }
  if (permission === "manage_settings") {
    return perms.includes("settings.view") || perms.includes("settings.update") || perms.includes("serviceAreas.view") || perms.includes("serviceAreas.update");
  }
  if (permission === "manage_tasks") {
    return perms.includes("bookings.view");
  }
  if (permission === "manage_users") {
    return perms.includes("users.view") || perms.includes("users.create");
  }
  if (permission === "manage_fleet") {
    return perms.includes("drivers.view") || perms.includes("settings.view");
  }

  return false;
}

export async function getSessionUser(req: NextRequest | Request) {
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return null;
  return {
    id: token.id as string,
    email: token.email as string,
    role: token.role as string,
    permissions: (token.permissions as string[]) || []
  };
}

export async function checkPermission(req: NextRequest | Request, requiredPermission: string): Promise<boolean> {
  const user = await getSessionUser(req);
  if (!user) return false;
  return hasPermission(user.role, requiredPermission, user.permissions);
}

export async function requirePermission(req: NextRequest | Request, permission: string) {
  const user = await getSessionUser(req);
  if (!user) {
    return { success: false, status: 401, error: "Unauthenticated access: Please log in." as string, user: null };
  }
  if (!hasPermission(user.role, permission, user.permissions)) {
    return { success: false, status: 403, error: "Unauthorized access: You lack the required permissions." as string, user };
  }
  return { success: true, status: 200, error: null, user };
}

export function unauthenticated() {
  return NextResponse.json({ success: false, error: "Unauthenticated access: Please log in." }, { status: 401 });
}

export function unauthorized() {
  return NextResponse.json({ success: false, error: "Unauthorized access: You lack the required permissions." }, { status: 403 });
}
