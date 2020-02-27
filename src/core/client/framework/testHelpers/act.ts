import TestRenderer from "react-test-renderer";

import { isPromiseLike } from "coral-common/utils";

export default function act<T>(callback: () => T): T {
  let callbackResult: T;
  const actResult = TestRenderer.act(() => {
    callbackResult = callback();
    if (isPromiseLike(callbackResult!)) {
      return callbackResult as any;
    }
    return;
  });
  if (isPromiseLike(callbackResult!)) {
    // Return it this way, to preserve warnings that React emits.
    return {
      then(resolve: (value: any) => void, reject: (err?: Error) => void) {
        (actResult as PromiseLike<any>).then(() => {
          resolve(callbackResult);
        }, reject);
      },
    } as any;
  }
  return callbackResult!;
}
