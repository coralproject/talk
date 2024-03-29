import { EventEmitter2 } from "eventemitter2";

/** A substitute for string.startsWith */
function startsWith(str: string, search: string, pos?: number) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
}

const withEventEmitter = (
  streamEventEmitter: EventEmitter2,
  embedEventEmitter: EventEmitter2,
  enableDeprecatedEvents = false
) => {
  // Pass events from stream to the embedEventEmitter.
  streamEventEmitter.onAny(function (eventName: string, value: string) {
    let emitEventName = "";
    if (["ready"].includes(eventName)) {
      emitEventName = eventName;
    } else if (startsWith(eventName, "viewer.")) {
      emitEventName = eventName.substr("viewer.".length);
    } else if (enableDeprecatedEvents) {
      if (startsWith(eventName, "mutation.")) {
        emitEventName = eventName;
      } else if (startsWith(eventName, "fetch.")) {
        emitEventName = eventName;
      } else if (startsWith(eventName, "subscription.")) {
        emitEventName = eventName;
      }
    }
    if (emitEventName) {
      embedEventEmitter.emit(emitEventName, value);
    }
  });
};

export default withEventEmitter;
