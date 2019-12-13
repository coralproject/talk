import { EventEmitter2 } from "eventemitter2";

import { Decorator } from "./types";

const withEventEmitter = (
  eventEmitter: EventEmitter2,
  enableDeprecatedEvents = false
): Decorator => pym => {
  // Pass events from iframe to the event emitter.
  pym.onMessage("event", (raw: string) => {
    const { eventName, value } = JSON.parse(raw);
    // TODO: (cvle) Remove this when no longer needed.
    if (!enableDeprecatedEvents) {
      if ((eventName as string).startsWith("mutation.")) {
        return;
      }
      if ((eventName as string).startsWith("fetch.")) {
        return;
      }
      if ((eventName as string).startsWith("subscription.")) {
        return;
      }
    }
    eventEmitter.emit(eventName, value);
  });

  // Notify ready state.
  pym.onMessage("ready", () => {
    eventEmitter.emit("ready");
  });
};

export default withEventEmitter;
