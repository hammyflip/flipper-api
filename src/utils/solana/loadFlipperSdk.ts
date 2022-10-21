import AnchorWallet from "@hammyflip/flipper-sdk/dist/types/AnchorWallet";
import getAuthorityKeypair from "src/utils/solana/getAuthorityKeypair";
import getConnection from "src/utils/solana/getConnection";
import * as anchor from "@project-serum/anchor";
import FlipperSdk from "@hammyflip/flipper-sdk";

export default function loadFlipperSdk() {
  const connection = getConnection();
  const authorityKeypair = getAuthorityKeypair();
  const wallet: AnchorWallet = new anchor.Wallet(authorityKeypair);

  return new FlipperSdk({
    authority: authorityKeypair.publicKey,
    connection,
    wallet,
  });
}
