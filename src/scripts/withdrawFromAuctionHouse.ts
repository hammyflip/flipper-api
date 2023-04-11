/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import FlipperSdk from "@hammyflip/flipper-sdk";
import AnchorWallet from "@hammyflip/flipper-sdk/dist/types/AnchorWallet";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import invariant from "tiny-invariant";
import yargs from "yargs";
import * as anchor from "@project-serum/anchor";
import AUCTION_HOUSE_SCRIPT_CONFIG from "src/scripts/constants/AuctionHouseScriptConfig";

const WRAPPED_SOL_MINT = new PublicKey(
  "So11111111111111111111111111111111111111112"
);

async function run() {
  const { amount, network } = yargs(process.argv.slice(2))
    .options({
      amount: {
        type: "number",
      },
      network: {
        type: "string",
      },
    })
    .parseSync();

  invariant(network != null);
  invariant(network in AUCTION_HOUSE_SCRIPT_CONFIG);
  console.log(`Creating auction house for ${network}`);
  const scriptConfig =
    AUCTION_HOUSE_SCRIPT_CONFIG[
      network as keyof typeof AUCTION_HOUSE_SCRIPT_CONFIG
    ];
  const { authorityKeypair, rpc } = scriptConfig;
  const authority = authorityKeypair.publicKey;

  const connection = new Connection(rpc, { commitment: "confirmed" });
  const wallet: AnchorWallet = new anchor.Wallet(authorityKeypair);
  const sdk = new FlipperSdk({
    authority,
    connection,
    wallet,
  });

  const auctionHouseAccount = await sdk.fetchAuctionHouse(
    authority,
    WRAPPED_SOL_MINT
  );
  console.log("Auction house info:");
  console.log(JSON.stringify(auctionHouseAccount.account, null, 2));

  const tx = await sdk.withdrawFromTreasuryTx(
    {
      creator: authority,
      treasuryMint: WRAPPED_SOL_MINT,
      treasuryWithdrawalDestination:
        scriptConfig.treasuryWithdrawalDestination ??
        scriptConfig.authorityKeypair.publicKey,
    },
    {
      amount: amount! * LAMPORTS_PER_SOL,
    }
  );

  const txid = await connection.sendTransaction(tx, [authorityKeypair], {
    preflightCommitment: "confirmed",
  });
  await connection.confirmTransaction(txid, "confirmed");

  console.log(`Withdrew ${amount} SOL from treasury, txid: ${txid}`);
}

run();
