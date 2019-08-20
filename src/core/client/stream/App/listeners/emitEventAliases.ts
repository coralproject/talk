import { EventEmitter2 } from "eventemitter2";

export default function emitEventAliases(
  eventEmitter: EventEmitter2,
  eventName: string,
  value: any
) {
  switch (eventName) {
    case "mutation.showAuthPopup":
      switch (value.view) {
        case "SIGN_IN":
          eventEmitter.emit("loginPrompt");
          break;
      }
      break;
  }
}
