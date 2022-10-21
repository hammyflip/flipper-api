/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */

import FlipperSdk from "@hammyflip/flipper-sdk";
import AnchorWallet from "@hammyflip/flipper-sdk/dist/types/AnchorWallet";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import invariant from "tiny-invariant";
import yargs from "yargs";
import * as anchor from "@project-serum/anchor";

const WRAPPED_SOL_MINT = new PublicKey(
  "So11111111111111111111111111111111111111112"
);

const SCRIPT_CONFIG = {
  devnet: {
    authorityKeypair: Keypair.fromSecretKey(
      // Pubkey: authyWritV3BSybcBdkQc1fMaQ7ycidrvYiRKvtjbec
      Uint8Array.from([
        182, 74, 16, 180, 130, 255, 197, 4, 168, 112, 122, 92, 194, 237, 212,
        154, 49, 222, 244, 255, 186, 240, 68, 244, 194, 227, 61, 143, 109, 157,
        57, 137, 8, 175, 248, 167, 5, 201, 207, 58, 35, 0, 105, 30, 172, 124,
        77, 159, 41, 127, 165, 76, 192, 146, 116, 195, 168, 230, 242, 12, 191,
        195, 221, 173,
      ])
    ),
    rpc: "https://solana-devnet.g.alchemy.com/v2/0PtPFnNoKnEHIiSRcpCQcghlcPQjLEXf",
  },
  mainnet: {
    // TODO: fill in
    authorityKeypair: Keypair.generate(),
    rpc: "https://solana-mainnet.g.alchemy.com/v2/aUXAUP4gLtiYHVBYp4uGFi2QO8lIomFG",
  },
};

async function run() {
  const { network } = yargs(process.argv.slice(2))
    .options({
      network: {
        type: "string",
      },
    })
    .parseSync();

  invariant(network != null);
  invariant(network in SCRIPT_CONFIG);
  console.log(`Creating auction house for ${network}`);
  const scriptConfig = SCRIPT_CONFIG[network as keyof typeof SCRIPT_CONFIG];
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
      console.log("Auction house already exists, exiting...");
      console.log(JSON.stringify(auctionHouseAccount.account, null, 2));
      return;
    }
  } catch {
    // Sallow
  }

  const tx = await sdk.createAuctionHouseTx(
    {
      payer: authority,
      // TODO: should support creating auction houses for different SPL tokens
      treasuryMint: WRAPPED_SOL_MINT,
      treasuryWithdrawalDestination: scriptConfig.authorityKeypair.publicKey,
      treasuryWithdrawalDestinationOwner:
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
