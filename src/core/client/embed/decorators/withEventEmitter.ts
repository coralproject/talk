import { EventEmitter2 } from "eventemitter2";

import startsWith from "coral-common/utils/startsWith";

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
      if (startsWith(eventName as string, "mutation.")) {
        return;
      }
      if (startsWith(eventName as string, "fetch.")) {
        return;
      }
      if (startsWith(eventName as string, "subscription.")) {
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
