// import { PrismaClient } from "@prisma/client";
// const globalForPrisma = globalThis as {
//   prisma?: PrismaClient;
// };
// export const prisma =
//   globalForPrisma.prisma ?? new PrismaClient();
// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { env } from "./env.js";
const pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
});
pool.on("error", (err) => {
    console.error("[PostgreSQL Pool Error]:", err?.message || err);
});
const adapter = new PrismaPg(pool);
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
    });
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
//# sourceMappingURL=prisma.js.map