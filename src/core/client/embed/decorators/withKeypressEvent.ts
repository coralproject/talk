import { KeyboardEventData } from "coral-stream/common/KeyboardShortcuts/KeyboardShortcuts";

import onIntersectChange from "../onIntersectChange";
import { Decorator } from "./types";

const withKeypressEvent: Decorator = (pym) => {
  const handleKeypress = (e: KeyboardEvent) => {
    // Ignore events that came from elements that accepts user input.
    if (e.target) {
      const el = e.target as HTMLElement;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        return;
      }
      if (el.isContentEditable) {
        return;
      }
    }
    const payload: KeyboardEventData = {
      key: e.key,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
    };

    pym.sendMessage("keypress", JSON.stringify(payload));
  };

  // Only listen to keypress events when iframe is visible.
  const disconnectObserver = onIntersectChange(
    pym.el,
    (isIntersecting) => {
      if (isIntersecting) {
        document.addEventListener("keypress", handleKeypress);
      } else {
        document.removeEventListener("keypress", handleKeypress);
      }
    },
    { rootMargin: "-100px -20px" }
  );

  // Return cleanup callback.
  return () => {
    disconnectObserver();

    // Remove the event listeners.
    document.removeEventListener("keypress", handleKeypress);
  };
};

export default withKeypressEvent;
