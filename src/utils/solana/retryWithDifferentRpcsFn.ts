import { Connection } from "@solana/web3.js";
import getConnection from "src/utils/solana/getConnection";
import getConnectionBackup from "src/utils/solana/getConnectionBackup";

export default async function retryWithDifferentRpcsFn<T>(
  fn: (connection: Connection) => Promise<T>,
  fnName: string,
  isResultValid?: (result: T) => boolean
): Promise<T> {
  const defaultConnection = getConnection();

  try {
    const result = await fn(defaultConnection);
    const shouldReturn = isResultValid == null || isResultValid(result);

    if (shouldReturn) {
      return result;
    }
  } catch {
    // Swallow
  }

  const retries = await Promise.all(
    [getConnectionBackup()].map(async (connection) => {
      try {
        const result = await fn(connection);
        return { result, success: true };
      } catch (e) {
        return { errorMessage: (e as Error).message, success: false };
      }
    })
  );

  const fulfilled = retries.filter((retry) => retry.success);
  const validResult = fulfilled.find(
    (retry) => isResultValid == null || isResultValid(retry.result as T)
  );

  if (validResult == null) {
    // It's the caller's responsibility to handle this error.
    throw new Error(`Could not find valid result for ${fnName}`);
  }

  return validResult.result!;
}
