import { Connection, ConnectionConfig } from "@solana/web3.js";
import { Maybe } from "src/types/UtilityTypes";
import CONNECTION_CONFIG from "src/constants/ConnectionConfig";

let connection: Maybe<Connection> = null;

export default function getConnection(config?: ConnectionConfig) {
  if (connection == null) {
    connection = new Connection(
      process.env.SOLANA_RPC_URL as string,
      config ?? CONNECTION_CONFIG
    );
    return connection;
  }

  return connection;
}
