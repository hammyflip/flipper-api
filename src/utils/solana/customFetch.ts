import { Duration } from "dayjs/plugin/duration";
import dayjs from "src/utils/dates/dayjsex";
import fetch, { RequestInfo, RequestInit, Response } from "node-fetch";
import { Maybe } from "src/types/UtilityTypes";

const RPC_METHOD_TIMEOUTS: { [key: string]: Duration } = {
  getParsedTransaction: dayjs.duration({ seconds: 20 }),
};

function getRpcMethod(init: RequestInit): Maybe<string> {
  const body = init.body?.toString();
  if (body == null) {
    return null;
  }

  try {
    const bodyParsed = JSON.parse(body);
    return bodyParsed.method;
  } catch {
    return null;
  }
}

/**
 * Implementation inspired by https://www.npmjs.com/package/node-fetch and
 * https://dmitripavlutin.com/timeout-fetch-request/
 */
export default async function customFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const rpcMethod = init == null ? null : getRpcMethod(init);
  if (rpcMethod == null || RPC_METHOD_TIMEOUTS[rpcMethod] == null) {
    return fetch(input, init);
  }

  const timeoutDuration = RPC_METHOD_TIMEOUTS[rpcMethod];
  const timeoutMs = timeoutDuration.asMilliseconds();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(input, {
      ...init,
      // @ts-ignore see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/60868
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
