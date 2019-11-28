import TestRenderer from "react-test-renderer";

import { isPromiseLike } from "coral-common/utils";

export function actWithAsyncTypes(
  callback: () => Promise<void> | void | undefined
): Promise<void> | void {
  return TestRenderer.act(callback as any) as any;
}

export function actAndReturn<T>(callback: () => T): T {
  let callbackResult: T;
  const actResult = actWithAsyncTypes(() => {
    callbackResult = callback();
    return callbackResult as any;
  });
  if (isPromiseLike(callbackResult!)) {
    return new Promise((resolve, reject) => {
      (actResult as PromiseLike<any>).then(() => {
        resolve(callbackResult);
      });
    }) as any;
  }
  return callbackResult!;
}
export const act = actAndReturn;
