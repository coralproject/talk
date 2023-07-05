import { ReactTestInstance } from "react-test-renderer";

import wait from "./wait";

interface Options {
  timeout?: number;
  interval?: number;
}

export default async function waitUntilThrow(
  callback: () => ReactTestInstance | null,
  options?: Options
): Promise<void> {
  await wait(() => {
    expect(callback).toThrow();
  }, options);
}
