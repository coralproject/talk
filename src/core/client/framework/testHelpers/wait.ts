import waitForExpect from "wait-for-expect";

interface Options {
  timeout?: number;
  interval?: number;
}

export default async function wait(
  callback: () => void,
  { timeout = 4500, interval = 50 }: Options = {}
) {
  return waitForExpect(callback, timeout, interval);
}
