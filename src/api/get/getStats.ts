/* eslint-disable no-plusplus */
import { currency, flip as flipType, user } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import NUMBER_TO_HEADS_OR_TAILS from "src/constants/NumberToHeadsOrTails";
import SortOrder from "src/types/enums/SortOrder";
import groupBy from "src/utils/array/groupBy";
import dayjs from "src/utils/dates/dayjsex";
import getCompareByProperty from "src/utils/getCompareByProperty";
import getPrisma from "src/utils/prisma/getPrisma";

type Flip = flipType & {
  currency: currency;
  user: user;
};

type WinOrLose = "win" | "lose";

function getStreaksForUser(flips: Array<Flip>, winOrLose: WinOrLose) {
  const streaks: Array<number> = [];
  let currentStreak = 0;
  flips.forEach((flip) => {
    const didWin = flip.flipsPrediction === flip.flipsResult;
    if ((winOrLose === "win" && didWin) || (winOrLose === "lose" && !didWin)) {
      currentStreak++;
    } else {
      streaks.push(currentStreak);
      currentStreak = 0;
    }
  });

  return streaks;
}

function getHighestStreaks(flips: Array<Flip>, winOrLose: WinOrLose) {
  const groupedByUser = groupBy(flips, ({ userId }) => userId);
  const groupedByUserEntries = Object.entries(groupedByUser);
  const userStreaks = groupedByUserEntries
    .map((userIdAndFlips) => {
      const streaksForUser = getStreaksForUser(userIdAndFlips[1], winOrLose);
      return streaksForUser.map((streak) => ({
        userId: userIdAndFlips[0],
        streak,
      }));
    })
    .flat();
  return userStreaks.sort(getCompareByProperty("streak", SortOrder.Desc));
}

function getFlipPredictions(flips: Array<Flip>) {
  const numHeads = flips.filter(
    ({ flipsPrediction }) =>
      NUMBER_TO_HEADS_OR_TAILS[flipsPrediction] === "heads"
  ).length;
  const numTails = flips.filter(
    ({ flipsPrediction }) =>
      NUMBER_TO_HEADS_OR_TAILS[flipsPrediction] === "tails"
  ).length;

  return { numHeads, numTails };
}

function getFlipResults(flips: Array<Flip>) {
  const numHeads = flips.filter(
    ({ flipsResult }) => NUMBER_TO_HEADS_OR_TAILS[flipsResult] === "heads"
  ).length;
  const numTails = flips.filter(
    ({ flipsResult }) => NUMBER_TO_HEADS_OR_TAILS[flipsResult] === "tails"
  ).length;

  return { numHeads, numTails };
}

export default async function getStats(
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const prisma = getPrisma();
  const flips = await prisma.flip.findMany({
    include: {
      currency: true,
      user: true,
    },
    orderBy: {
      timeCreated: "desc",
    },
    where: {
      timeCreated: {
        gte: dayjs()
          .subtract(dayjs.duration({ hours: 24 }))
          .toDate(),
      },
    },
  });

  res.json({
    flipPredictions: getFlipPredictions(flips),
    flipResults: getFlipResults(flips),
    losingStreaks: getHighestStreaks(flips, "lose")
      .slice(0, 10)
      .filter(({ streak }) => streak > 0),
    winStreaks: getHighestStreaks(flips, "win")
      .slice(0, 10)
      .filter(({ streak }) => streak > 0),
  });
}
