import ResizeObserver from "resize-observer-polyfill";

import { parseQuery } from "coral-common/utils";
import { FrameHeightMessage } from "coral-framework/components/Frame";
import { getBrowserInfo } from "coral-framework/lib/browserInfo";
import { PostMessageService } from "coral-framework/lib/postMessage";
import { getContentBoxSize } from "coral-ui/helpers";

async function injectConditionalPolyfills() {
  const pending: Promise<any>[] = [];
  const browser = getBrowserInfo(window);

  // Polyfill Intersection Observer.
  if (!browser.supports.intersectionObserver) {
    pending.push(import("intersection-observer"));
  }

  // Polyfill Resize Observer.
  if (!browser.supports.resizeObserver) {
    pending.push(import("coral-framework/helpers/polyfillResizeObserver"));
  }

  await Promise.all(pending);
}

async function main() {
  const { frameID } = parseQuery(location.search);
  if (!window.parent || !frameID) {
    return;
  }
  await injectConditionalPolyfills();

  const postMessage = new PostMessageService(
    window,
    "coral",
    window.parent,
    "*"
  );

  new ResizeObserver((entries) => {
    if (entries.length > 1) {
      throw new Error("Not expected length to be > 1");
    }
    const entry = entries[0];
    const contentBoxSize = getContentBoxSize(entry);
    if (contentBoxSize === null) {
      // eslint-disable-next-line no-console
      console.warn("ResizeObserver contains invalid `contentBoxSize`", entries);
    }
    const msg: FrameHeightMessage = {
      frameID,
      height: contentBoxSize!.blockSize,
    };
    postMessage.send("frameHeight", msg);
  }).observe(window.document.body);
}

export default main;
