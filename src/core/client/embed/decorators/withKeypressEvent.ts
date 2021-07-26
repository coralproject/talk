import { KeyboardEventData } from "coral-stream/common/KeyboardShortcuts/KeyboardShortcuts";

import { Decorator } from "./types";

const withKeypressEvent: Decorator = (pym) => {
  const handleKeypress = (e: KeyboardEvent) => {
    const payload: KeyboardEventData = {
      key: e.key,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
    };

    pym.sendMessage("keypress", JSON.stringify(payload));
  };

  document.addEventListener("keypress", handleKeypress);

  // Return cleanup callback.
  return () => {
    // Remove the event listeners.
    document.removeEventListener("keypress", handleKeypress);
  };
};

export default withKeypressEvent;
