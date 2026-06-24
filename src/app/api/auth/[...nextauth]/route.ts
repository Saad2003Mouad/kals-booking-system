import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const rateLimitMap = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const emailInput = credentials.email.trim().toLowerCase();

        // Rate Limit Check
        const now = Date.now();
        const record = rateLimitMap.get(emailInput);
        if (record && record.lockedUntil > now) {
          throw new Error("Too many failed attempts. Please try again later.");
        }
        if (record && record.lockedUntil <= now) {
          rateLimitMap.delete(emailInput);
        }

        // SQLite-compatible case-insensitive email lookup
        const allUsers = await prisma.user.findMany({
          where: {},
          select: { id: true, email: true, role: true, permissions: true, passwordHash: true, active: true },
        });
        const user = allUsers.find(u => u.email.toLowerCase() === emailInput);
        
        if (!user) {
          recordFailure(emailInput);
          return null;
        }

        if (user.active === false) {
          recordFailure(emailInput);
          throw new Error("This account has been deactivated. Please contact an administrator.");
        }

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) {
          recordFailure(emailInput);
          return null;
        }

        // Success - clear rate limit
        rateLimitMap.delete(emailInput);
        return { id: user.id, email: user.email, role: user.role, permissions: user.permissions };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { 
        token.role = (user as any).role; 
        token.id = user.id; 
        token.permissions = (user as any).permissions || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).permissions = token.permissions || [];
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

function recordFailure(email: string) {
  const now = Date.now();
  const record = rateLimitMap.get(email) || { count: 0, lockedUntil: 0 };
  if (record.lockedUntil > now) return; // already locked
  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCK_MINUTES * 60000;
  }
  rateLimitMap.set(email, record);
}

export { handler as GET, handler as POST };
