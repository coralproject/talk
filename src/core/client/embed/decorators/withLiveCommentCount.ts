import { EventEmitter2 } from "eventemitter2";

import {
  COUNT_NUMBER_CLASS_NAME,
  COUNT_SELECTOR,
  COUNT_TEXT_CLASS_NAME,
  COUNT_UNREAD_NUMBER_CLASS_NAME,
  COUNT_UNREAD_TEXT_CLASS_NAME,
} from "coral-framework/constants";

/**
 * withLiveCommentCount will listen to `commentCount` events
 * and update any comment counts managed by our `count.js` script.
 */
const withLiveCommentCount = (streamEventEmitter: EventEmitter2) => {
  streamEventEmitter.on("commentCount", (args) => {
    updateCountTexts(
      COUNT_SELECTOR,
      COUNT_NUMBER_CLASS_NAME,
      COUNT_TEXT_CLASS_NAME,
      args
    );
  });

  streamEventEmitter.on("unreadCommentCount", (args) => {
    updateCountTexts(
      COUNT_SELECTOR,
      COUNT_UNREAD_NUMBER_CLASS_NAME,
      COUNT_UNREAD_TEXT_CLASS_NAME,
      args
    );
  });
};

const updateCountTexts = (
  selector: string,
  numberSelector: string,
  textSelector: string,
  args: any
) => {
  // Find all matching elements.
  const elements = document.querySelectorAll(
    `${selector}[data-coral-url='${args.storyURL}'], ${selector}[data-coral-id='${args.storyID}']`
  );
  elements.forEach((element) => {
    // Replace number.
    element.querySelectorAll(numberSelector).forEach((no) => {
      no.innerHTML = args.number;
    });
    // Replace text.
    element.querySelectorAll(textSelector).forEach((no) => {
      no.innerHTML = args.text;
    });
  });
};

export default withLiveCommentCount;
