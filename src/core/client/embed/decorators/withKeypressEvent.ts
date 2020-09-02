import { Decorator } from "./types";

const withKeypressEvent: Decorator = (pym) => {
  const handleKeypress = (e: KeyboardEvent) => {
    const payload = {
      key: e.key,
      shiftKey: e.shiftKey,
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
