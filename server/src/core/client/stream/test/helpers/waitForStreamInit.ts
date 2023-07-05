import { ReactTestRenderer } from "react-test-renderer";

import waitForRTE from "./waitForRTE";

export default async function waitForCommentsTabInit(
  testRenderer: ReactTestRenderer
) {
  // Wait for RTE initialization.
  await waitForRTE(testRenderer.root, "Post a comment");
  return;
}
