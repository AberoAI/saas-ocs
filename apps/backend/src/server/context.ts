import type { inferAsyncReturnType } from "@trpc/server";
import type { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import prisma from "../../../../packages/shared/src/prisma";

interface JWTPayload {
  tenantId: string;
  id: string;
}

export async function createContext({ req }: { req: NextApiRequest }) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    return {
      userId: payload.id,
      tenantId: payload.tenantId,
      prisma,
    };
  } catch {
    throw new Error("Unauthorized");
  }
}

export type Context = inferAsyncReturnType<typeof createContext>;
