import { Keypair } from "@solana/web3.js";
import invariant from "tiny-invariant";

export default function getAuthorityKeypair(): Keypair {
  const authority = process.env.AUTHORITY;

  invariant(
    authority != null && authority !== "",
    "process.env.AUTHORITY must be defined"
  );

  const authorityKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(authority))
  );
  return authorityKeypair;
}
