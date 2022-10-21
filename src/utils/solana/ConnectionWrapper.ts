import {
  ConfirmOptions,
  sendAndConfirmTransaction,
  Signer,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import addLatestValidBlockheightToTx from "src/utils/solana/addLatestValidBlockheightToTx";
import getConnection from "src/utils/solana/getConnection";

export default class ConnectionWrapper {
  static async sendAndConfirmTransaction(
    transaction: Transaction,
    signers: Array<Signer>,
    options: ConfirmOptions = {
      commitment: "confirmed",
      preflightCommitment: "confirmed",
    }
  ): Promise<TransactionSignature> {
    const connection = getConnection();
    return sendAndConfirmTransaction(
      connection,
      await addLatestValidBlockheightToTx(connection, transaction),
      signers,
      options
    );
  }
}
