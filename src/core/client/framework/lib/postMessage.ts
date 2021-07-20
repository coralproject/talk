type PostMessageHandler = (value: any, name: string) => void;

/**
 * Wrapper around the HTML postMessage API.
 */
export class PostMessageService {
  private window: Window;
  private scope: string;
  private defaultTarget: Window;
  private defaultTargetOrigin: string;

  constructor(
    window: Window,
    scope: string,
    defaultTarget: Window,
    defaultTargetOrigin: string
  ) {
    this.window = window;
    this.scope = scope;
    this.defaultTarget = defaultTarget;
    this.defaultTargetOrigin = defaultTargetOrigin;
  }

  /**
   * Send a message over the postMessage API
   *
   * @param name string name of the message
   * @param value string value of the message
   * @param target Window target window, e.g. window.opener
   * @param targetOrigin string origin of target
   */
  public send(name: string, value: any, target?: Window, targetOrigin = "*") {
    if (!target) {
      if (!this.defaultTargetOrigin) {
        return;
      }
      target = this.defaultTarget;
      targetOrigin = this.defaultTargetOrigin;
    }

    // Serialize the message to be sent via postMessage.
    const msg = { name, value, scope: this.scope };

    // Send the message.
    target.postMessage(msg, targetOrigin);
  }

  /**
   * Subscribe to messages
   *
   * @param name string Name of the message
   * @param handler PostMessageHandler
   */
  public on(name: string, handler: PostMessageHandler) {
    const listener = (event: MessageEvent) => {
      if (
        !event.data ||
        typeof event.data.scope !== "string" ||
        event.data.scope !== this.scope
      ) {
        return;
      }
      if (event.data.name !== name) {
        return;
      }
      handler(event.data.value, event.data.name);
    };
    // Attach the listener to the target.
    this.window.addEventListener("message", listener);
    return () => {
      this.window.removeEventListener("message", listener);
    };
  }
}
