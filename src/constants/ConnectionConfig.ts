import { ConnectionConfig } from "@solana/web3.js";
import customFetch from "src/utils/solana/customFetch";

const CONNECTION_CONFIG: ConnectionConfig = {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 90 * 1000,
  fetch: customFetch,
};

export default CONNECTION_CONFIG;
