type PostMessageHandler = (value: any, name: string) => void;

/**
 * Wrapper around the HTML postMessage API.
 */
export class PostMessageService {
  private origin: string;
  private scope: string;

  constructor(
    scope = "talk",
    origin: string = `${location.protocol}//${location.host}`
  ) {
    this.origin = origin;
    this.scope = scope;
  }

  /**
   * Send a message over the postMessage API
   * @param name string name of the message
   * @param value string value of the message
   * @param target Window target window, e.g. window.opener
   * @param targetOrigin string origin of target
   */
  public send(name: string, value: any, target: Window, targetOrigin?: string) {
    if (!target) {
      return;
    }

    // Serialize the message to be sent via postMessage.
    const msg = { name, value, scope: this.scope };

    // Send the message.
    target.postMessage(msg, targetOrigin || this.origin);
  }

  /**
   * Subscribe to messages
   * @param name string Name of the message
   * @param handler PostMessageHandler
   */
  public on(name: string, handler: PostMessageHandler) {
    const listener = (event: MessageEvent) => {
      if (!event.origin) {
        if (process.env.NODE_ENV !== "test") {
          // tslint:disable-next-line:no-console
          console.warn("empty origin received in postMessage", name);
        }
      } else if (event.origin !== this.origin) {
        return;
      }
      if (event.data.scope !== this.scope) {
        return;
      }
      if (event.data.name !== name) {
        return;
      }
      handler(event.data.value, event.data.name);
    };
    // Attach the listener to the target.
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }
}
