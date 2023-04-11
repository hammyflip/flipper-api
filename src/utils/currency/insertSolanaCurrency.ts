import getPrisma from "src/utils/prisma/getPrisma";
import { WRAPPED_SOL_MINT } from "@hammyflip/flipper-sdk/dist/constants/AccountConstants";

export default async function insertSolanaCurrency() {
  const prisma = getPrisma();
  const existing = await prisma.currency.findUnique({
    where: {
      name: "Solana",
    },
  });

  if (existing != null) {
    return existing;
  }

  return prisma.currency.create({
    data: {
      decimals: 9,
      mint: WRAPPED_SOL_MINT.toString(),
      name: "Solana",
      shortSymbol: "◎",
      symbol: "SOL",
    },
  });
}
