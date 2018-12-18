import { animationFrame, timeout } from "talk-common/utils";

export default async function waitForResize() {
  // This is implementation detail, what else could we do?..
  await animationFrame();
  await timeout();
}
