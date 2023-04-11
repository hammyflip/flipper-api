import { Maybe } from "src/types/UtilityTypes";
import { PrismaClient } from "@prisma/client";

let prisma: Maybe<PrismaClient> = null;

/**
 * Prisma client is used as a singleton. The first call to getPrisma decides
 * the database URL. This is mainly used in tests to use the URl of some test database.
 *
 * @param databaseUrl the URL of the database Prisma connects to.
 */
export default function getPrisma(databaseUrl?: string) {
  if (prisma) {
    return prisma;
  }

  if (databaseUrl != null) {
    prisma = new PrismaClient({
      datasources: { db: { url: databaseUrl } },
    });
  } else {
    prisma = new PrismaClient();
  }

  return prisma;
}
