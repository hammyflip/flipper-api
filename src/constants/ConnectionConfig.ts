import { ConnectionConfig } from "@solana/web3.js";

const CONNECTION_CONFIG: ConnectionConfig = {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 90 * 1000,
};

export default CONNECTION_CONFIG;
