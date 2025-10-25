import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
// import config from "../lib/config";

import ws from "ws";
// import posthog from "@/posthog/server-init";
// import { v4 } from "uuid";

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true;

// Type definitions
declare global {
  var prisma: PrismaClient | undefined;
}

export type ErrorResponse<T> = {
  success: false;
  error: string;
  code?: string;
  data: T | null;
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type QueryResponse<T> = ErrorResponse<T> | SuccessResponse<T>;

export type QueryResponseData<T, Y = unknown> = NonNullable<
  Extract<T, { success: true; data: Y }>["data"]
>;

export async function handlePrismaOperation<T>(
  operation: (prisma: PrismaClient) => Promise<T>,
): Promise<QueryResponse<T>> {
  try {
    const data = await operation(prisma);
    return { success: true, data };
  } catch (error) {
    // posthog.captureException(error, v4());
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        success: false,
        error: `Database error: ${error.message}`,
        code: error.code,
        data: null,
      };
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      return {
        success: false,
        error: "Invalid query parameters",
        data: null,
      };
    }
    return {
      success: false,
      error: `An unexpected error occurred: ${error}`,
      data: null,
    };
  }
}

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaNeon({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
