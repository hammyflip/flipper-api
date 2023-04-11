import { Keypair } from "@solana/web3.js";

const AUCTION_HOUSE_SCRIPT_CONFIG = {
  devnet: {
    authorityKeypair: Keypair.generate(),
    rpc: "https://api.devnet.solana.com",
    treasuryWithdrawalDestination: null,
    treasuryWithdrawalDestinationOwner: null,
  },
};

export default AUCTION_HOUSE_SCRIPT_CONFIG;
