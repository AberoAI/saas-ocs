// apps/backend/src/server/context.ts
import jwt from "jsonwebtoken";
import prisma from "shared/prisma";

interface JWTPayload {
  tenantId: string;
  id: string;
}

// Bentuk input serbaguna & netral (tidak bergantung Next)
type CreateContextInput =
  | { authorization?: string } // dari req.headers.authorization
  | { headers?: Record<string, string | string[] | undefined> } // headers mentah
  | { token?: string }; // token langsung

export type Context = {
  userId?: string;
  tenantId?: string;
  prisma: typeof prisma;
};

export async function createContext(input: CreateContextInput): Promise<Context> {
  let authHeader: string | undefined;

  if ("authorization" in input && typeof input.authorization === "string") {
    authHeader = input.authorization;
  } else if ("headers" in input && input.headers) {
    const h = input.headers["authorization"];
    authHeader = Array.isArray(h) ? h[0] : h;
  }

  const token =
    "token" in input && input.token
      ? input.token
      : (authHeader || "").replace(/^Bearer\s+/i, "");

  if (!token) return { prisma };

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return { userId: payload.id, tenantId: payload.tenantId, prisma };
  } catch {
    return { prisma };
  }
}
