import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";

export async function checkPermission(req: NextRequest | Request, requiredPermission: string) {
  try {
    // 1. Check for Dev/Test Headers
    const roleHeader = req.headers.get("x-mock-user-role");
    const permsHeader = req.headers.get("x-mock-user-permissions");
    
    if (roleHeader) {
      if (roleHeader === "OWNER") return true;
      const perms = permsHeader ? permsHeader.split(",") : [];
      return perms.includes(requiredPermission);
    }

    // 2. Real App Fallback (No session yet, grab an OWNER or ADMIN)
    const user = await prisma.user.findFirst({
      where: { role: { in: ["OWNER", "ADMIN"] } }
    });

    if (!user) return false;
    if (user.role === "OWNER") return true;
    if (user.permissions && user.permissions.includes(requiredPermission)) return true;

    return false;
  } catch (error) {
    console.error("RBAC Check Error", error);
    return false;
  }
}

export function unauthorized() {
  return NextResponse.json({ success: false, error: "Unauthorized access: You lack the required permissions." }, { status: 403 });
}
