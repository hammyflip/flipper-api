/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
export default async function retryFn<T>(
  fn: () => Promise<T>,
  fnName: string,
  numRetries: number,
  isResultValid?: (result: T) => boolean
): Promise<T> {
  for (let i = 0; i < numRetries; i++) {
    const isLastIter = i === numRetries - 1;
    try {
      const result = await fn();
      if (isResultValid == null || isResultValid(result)) {
        return result;
      }
    } catch {
      if (isLastIter) {
        // It's the caller's responsibility to handle this error.
        throw new Error(`Could not find valid result for ${fnName}`);
      }
    }
  }

  // It's the caller's responsibility to handle this error.
  throw new Error(`Could not find valid result for ${fnName}`);
}
