import {
  parseCreateBettorInfoIx,
  parsePlaceBetIx,
} from "@hammyflip/flipper-sdk";
import { PartiallyDecodedInstruction } from "@solana/web3.js";
import { NextFunction, Request, Response } from "express";
import getPrisma from "src/utils/prisma/getPrisma";
import combineTransactions from "src/utils/solana/combineTransactions";
import ConnectionWrapper from "src/utils/solana/ConnectionWrapper";
import getAuthorityKeypair from "src/utils/solana/getAuthorityKeypair";
import getConnection from "src/utils/solana/getConnection";
import loadFlipperSdk from "src/utils/solana/loadFlipperSdk";

function send500(res: Response, errorMessage: string) {
  res.status(500).json({ errorMessage });
}

async function verifyTx(res: Response, txid: string) {
  const prisma = getPrisma();

  const existingFlip = await prisma.flip.findFirst({
    where: {
      OR: [{ txid1: txid }, { txid2: txid }],
    },
  });

  if (existingFlip != null) {
    send500(res, "tx has already been processed");
    return null;
  }

  const connection = getConnection();
  // TODO: add retries
  const parsedTx = await connection.getParsedTransaction(txid);
  if (parsedTx == null) {
    send500(res, "tx could not be fetched via RPC");
    return null;
  }

  const { instructions } = parsedTx.transaction.message;
  if (instructions.length > 2) {
    send500(
      res,
      `tx has ${instructions.length} instructions, expected 2 at most`
    );
    return null;
  }

  if (instructions.length === 1) {
    const ix = instructions[0];
    const parsedIx = parsePlaceBetIx(ix as PartiallyDecodedInstruction);
    if (parsedIx == null) {
      send500(res, "invalid instruction");
      return null;
    }

    return parsedIx.accounts;
  }
  const ix1 = instructions[0];
  const ix2 = instructions[0];
  const parsedIx1 = parseCreateBettorInfoIx(ix1 as PartiallyDecodedInstruction);
  const parsedIx2 = parsePlaceBetIx(ix2 as PartiallyDecodedInstruction);
  if (parsedIx1 == null || parsedIx2 == null) {
    send500(res, "invalid instruction");
    return null;
  }

  return parsedIx2.accounts;
}

// TODO: implement
export default async function processBet(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const { txid } = req.body;

  const accounts = await verifyTx(res, txid);
  if (accounts == null) {
    return;
  }

  const sdk = loadFlipperSdk();

  const bettorInfoAccountBefore = await sdk.fetchBettorInfo(
    accounts.bettor,
    accounts.treasuryMint
  );

  const results = Math.round(Math.random());
  const flipTx = await sdk.flipTx(
    {
      bettor: accounts.bettor,
      treasuryMint: accounts.treasuryMint,
    },
    {
      results,
    }
  );
  const payoutTx = await sdk.payoutTx({
    bettor: accounts.bettor,
    treasuryMint: accounts.treasuryMint,
  });
  const tx = combineTransactions([flipTx, payoutTx]);

  // TODO: add retries
  const txid2 = await ConnectionWrapper.sendAndConfirmTransaction(tx, [
    getAuthorityKeypair(),
  ]);

  const prisma = getPrisma();
  const betAmount = bettorInfoAccountBefore.account.amount.toNumber();
  const flipsPrediction = bettorInfoAccountBefore.account.bets;
  await prisma.flip.create({
    data: {
      currency: {
        connect: {
          id: "foo",
        },
      },
      user: {
        connectOrCreate: {
          create: {
            id: accounts.bettor.toString(),
          },
          where: {
            id: accounts.bettor.toString(),
          },
        },
      },
      betAmount,
      flipsPrediction,
      flipsResult: results,
      txid1: txid,
      txid2,
    },
  });

  res.json({ betAmount, didUserWinBet: flipsPrediction === results });
}
