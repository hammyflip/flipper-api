import { Keypair, PublicKey } from "@solana/web3.js";

const AUCTION_HOUSE_SCRIPT_CONFIG = {
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
    treasuryWithdrawalDestination: null,
    treasuryWithdrawalDestinationOwner: null,
  },
  mainnet: {
    // Pubkey: auth6FQ5A3YM8YR77w8XzrCaTk4sSnUGAcNmPVtHMZT
    authorityKeypair: Keypair.generate(),
    rpc: "https://solana-mainnet.g.alchemy.com/v2/aUXAUP4gLtiYHVBYp4uGFi2QO8lIomFG",
    treasuryWithdrawalDestination: new PublicKey(
      "GXR7QUscSXaRnQhmxS2apqtePvqHuVHocoyjJdQVfSmq"
    ),
    treasuryWithdrawalDestinationOwner: new PublicKey(
      "GXR7QUscSXaRnQhmxS2apqtePvqHuVHocoyjJdQVfSmq"
    ),
  },
};

export default AUCTION_HOUSE_SCRIPT_CONFIG;
