import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

type CreateAuditLogParams = {
  entityType: string;
  entityId: string;
  action: string;
  actorId?: string | null;
  actorRole?: string | null;
  metadata?: Record<string, any>;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  bookingId?: string | null;
};

export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    let ipAddress: string | undefined;
    let userAgent: string | undefined;

    try {
      const headersList = headers();
      ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || undefined;
      userAgent = headersList.get("user-agent") || undefined;
      
      // Clean up IP if it's a comma-separated list
      if (ipAddress && ipAddress.includes(",")) {
        ipAddress = ipAddress.split(",")[0].trim();
      }
    } catch (err) {
      // headers() might throw if called outside of request context (e.g. cron jobs)
    }

    await prisma.auditLog.create({
      data: {
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        actorId: params.actorId || null,
        metadataJson: JSON.stringify(params.metadata || {}),
        actorRole: params.actorRole || null,
        previousValues: params.previousValues ? JSON.stringify(params.previousValues) : null,
        newValues: params.newValues ? JSON.stringify(params.newValues) : null,
        ipAddress: ipAddress,
        userAgent: userAgent,
        bookingId: params.bookingId || null,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Non-blocking
  }
}
