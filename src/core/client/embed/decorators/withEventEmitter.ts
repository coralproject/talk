import { EventEmitter2 } from "eventemitter2";

import { Decorator } from "./types";

const withEventEmitter = (eventEmitter: EventEmitter2): Decorator => pym => {
  // Pass events from iframe to the event emitter.
  pym.onMessage("event", (raw: string) => {
    const { eventName, value } = JSON.parse(raw);
    eventEmitter.emit(eventName, value);
  });

  // Notify ready state.
  pym.onMessage("ready", () => {
    eventEmitter.emit("ready");
  });
};

export default withEventEmitter;
