import { ReactTestInstance } from "react-test-renderer";

import wait from "./wait";

interface Options {
  timeout?: number;
  interval?: number;
}

export default async function waitForElement(
  callback: () => ReactTestInstance | null,
  options?: Options
): Promise<ReactTestInstance> {
  let result: ReactTestInstance | null = null;
  await wait(() => {
    result = callback();
    if (!result) {
      throw new Error();
    }
  }, options);
  return result!;
}
