import { EventEmitter2 } from "eventemitter2";

import { COUNT_SELECTOR } from "coral-framework/constants";

/**
 * withLiveCommentCount will listen to `commentCount` events
 * and update any comment counts managed by our `count.js` script.
 */
const withLiveCommentCount = (streamEventEmitter: EventEmitter2) => {
  streamEventEmitter.on("commentCount", (args) => {
    // Find all matching elements.
    const elements = document.querySelectorAll(
      `${COUNT_SELECTOR}[data-coral-url='${args.storyURL}'], ${COUNT_SELECTOR}[data-coral-id='${args.storyID}']`
    );
    elements.forEach((element) => {
      // Replace number.
      element.querySelectorAll(".coral-count-number").forEach((no) => {
        no.innerHTML = args.number;
      });
      // Replace text.
      element.querySelectorAll(".coral-count-text").forEach((no) => {
        no.innerHTML = args.text;
      });
    });
  });
};

export default withLiveCommentCount;
