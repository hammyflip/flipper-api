/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import {
  ConfirmOptions,
  Finality,
  ParsedTransactionWithMeta,
  sendAndConfirmTransaction,
  Signer,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import { Maybe } from "src/types/UtilityTypes";
import retryFn from "src/utils/retryFn";
import addLatestValidBlockheightToTx from "src/utils/solana/addLatestValidBlockheightToTx";
import retryWithDifferentRpcsFn from "src/utils/solana/retryWithDifferentRpcsFn";

export default class ConnectionWrapper {
  static async getParsedTransaction(
    signature: string,
    commitment?: Finality,
    numRetries = 1
  ): Promise<Maybe<ParsedTransactionWithMeta>> {
    const isResultValid = (result: Maybe<ParsedTransactionWithMeta>) =>
      result != null;

    const getResult = () =>
      retryWithDifferentRpcsFn(
        (connection) => connection.getParsedTransaction(signature, commitment),
        "getParsedTransaction",
        isResultValid
      );

    try {
      return retryFn(
        getResult,
        "getParsedTransaction",
        numRetries,
        isResultValid
      );
    } catch {
      return null;
    }
  }

  static async sendAndConfirmTransaction(
    transaction: Transaction,
    signers: Array<Signer>,
    numRetries = 1,
    options: ConfirmOptions = {
      commitment: "confirmed",
      preflightCommitment: "confirmed",
    }
  ): Promise<TransactionSignature> {
    const getResult = () =>
      retryWithDifferentRpcsFn(
        async (connection) =>
          sendAndConfirmTransaction(
            connection,
            await addLatestValidBlockheightToTx(connection, transaction),
            signers,
            options
          ),
        "sendAndConfirmTransaction"
      );

    return retryFn(getResult, "sendAndConfirmTransaction", numRetries);
  }
}
