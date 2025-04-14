import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import config from "@/lib/config";
import { Prisma } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true;

// Type definitions
declare global {
  var prisma: PrismaClient | undefined;
}

export type ErrorResponse<T> = {
  success: boolean;
  error: string;
  code?: string;
  data: T | null;
};

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type QueryResponse<T> = ErrorResponse<T> | SuccessResponse<T>;

export type QueryResponseData<T> = NonNullable<
  Extract<T, { success: true; data: any }>["data"]
>;

export async function handlePrismaOperation<T>(
  operation: () => Promise<T>,
): Promise<QueryResponse<T>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
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
      error: "An unexpected error occurred",
      data: null,
    };
  }
}

const connectionString = config.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma =
  global.prisma || new PrismaClient({ adapter, log: ["warn", "error"] });

if (process.env.NODE_ENV === "development") global.prisma = prisma;

export default prisma;
