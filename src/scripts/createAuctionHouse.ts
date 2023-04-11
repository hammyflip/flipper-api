/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import FlipperSdk from "@hammyflip/flipper-sdk";
import AnchorWallet from "@hammyflip/flipper-sdk/dist/types/AnchorWallet";
import { Connection, PublicKey } from "@solana/web3.js";
import invariant from "tiny-invariant";
import yargs from "yargs";
import * as anchor from "@project-serum/anchor";
import AUCTION_HOUSE_SCRIPT_CONFIG from "src/scripts/constants/AuctionHouseScriptConfig";

const WRAPPED_SOL_MINT = new PublicKey(
  "So11111111111111111111111111111111111111112"
);

async function run() {
  const { network } = yargs(process.argv.slice(2))
    .options({
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

  try {
    const auctionHouseAccount = await sdk.fetchAuctionHouse(
      authority,
      WRAPPED_SOL_MINT
    );
    if (auctionHouseAccount.account != null) {
      console.log(
        `Auction house already exists at address ${auctionHouseAccount.pubkey.toString()}, exiting...`
      );
      console.log(JSON.stringify(auctionHouseAccount.account, null, 2));
      return;
    }
  } catch {
    // Swallow
  }

  const tx = await sdk.createAuctionHouseTx(
    {
      payer: authority,
      // TODO: should support creating auction houses for different SPL tokens
      treasuryMint: WRAPPED_SOL_MINT,
      treasuryWithdrawalDestination:
        scriptConfig.treasuryWithdrawalDestination ??
        scriptConfig.authorityKeypair.publicKey,
      treasuryWithdrawalDestinationOwner:
        scriptConfig.treasuryWithdrawalDestinationOwner ??
        scriptConfig.authorityKeypair.publicKey,
    },
    {
      feeBasisPoints: 300,
    }
  );

  const txid = await connection.sendTransaction(tx, [authorityKeypair], {
    preflightCommitment: "confirmed",
  });
  await connection.confirmTransaction(txid, "confirmed");

  console.log("Auction house created!");

  const auctionHouseAccount = await sdk.fetchAuctionHouse(
    authority,
    WRAPPED_SOL_MINT
  );
  console.log(JSON.stringify(auctionHouseAccount.account, null, 2));
}

run();
