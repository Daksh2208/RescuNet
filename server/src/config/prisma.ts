import dns from "node:dns";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { env } from "./env.js";

// Ensure resilient DNS resolution for Neon Cloud PostgreSQL endpoints on networks where local DNS refuses queries (RCODE_REFUSED)
const originalLookup = dns.lookup;
const resolver = new dns.promises.Resolver();
resolver.setServers(["8.8.8.8", "1.1.1.1"]);

(dns as any).lookup = function (hostname: string, options: any, callback: any) {
  const cb = typeof options === "function" ? options : callback;
  const opts = typeof options === "object" ? options : {};
  if (typeof hostname === "string" && hostname.includes("neon.tech")) {
    resolver.resolve4(hostname).then(
      (addresses) => {
        if (opts && opts.all) {
          return cb(
            null,
            addresses.map((a) => ({ address: a, family: 4 }))
          );
        }
        return cb(null, addresses[0], 4);
      },
      () => originalLookup(hostname, options, cb)
    );
    return;
  }
  originalLookup(hostname, options, cb);
};

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

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
