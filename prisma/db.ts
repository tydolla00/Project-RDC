import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// TODO Figure out edge serverless Neon Stuff
// dotenv.config()
// neonConfig.webSocketConstructor = ws;
// const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = global.prisma || new PrismaClient({ adapter, log: ["query"] });

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
export default prisma;
