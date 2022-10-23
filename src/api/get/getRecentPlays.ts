import { NextFunction, Request, Response } from "express";
import getPrisma from "src/utils/prisma/getPrisma";
import toObject from "src/utils/toObject";

export default async function getRecentPlays(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const { skip, take } = req.query;

  const prisma = getPrisma();
  const recentPlays = await prisma.flip.findMany({
    include: {
      currency: true,
      user: true,
    },
    orderBy: {
      timeCreated: "desc",
    },
    skip: Number(skip),
    take: Number(take),
  });

  res.json({
    recentPlays: toObject(recentPlays),
  });
}
