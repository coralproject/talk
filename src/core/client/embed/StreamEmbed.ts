import { EventEmitter2 } from "eventemitter2";
import qs from "query-string";

import {
  Decorator,
  withAutoHeight,
  withClickEvent,
  withEventEmitter,
  withIOSSafariWidthWorkaround,
  withPymStorage,
  withSetCommentID,
} from "./decorators";
import PymControl from "./PymControl";
import { ensureEndSlash } from "./utils";

export interface StreamConfig {
  assetID?: string;
  assetURL?: string;
  commentID?: string;
  title: string;
  eventEmitter: EventEmitter2;
  id: string;
  rootURL: string;
}

export class StreamEmbed {
  private config: StreamConfig;
  private pymControl?: PymControl;

  constructor(config: StreamConfig) {
    this.config = config;
    if (config.commentID) {
      setTimeout(() => config.eventEmitter.emit("showPermalink"), 0);
    }
  }

  private assertRendered() {
    if (!this.pymControl) {
      throw new Error("Stream Embed must be rendered first");
    }
  }

  public on(eventName: string, callback: (data: any) => void) {
    return this.config.eventEmitter.on(eventName, callback);
  }

  public off(eventName: string, callback: (data: any) => void) {
    return this.config.eventEmitter.off(eventName, callback);
  }

  public login(token: string) {
    this.assertRendered();
    this.pymControl!.sendMessage("login", token);
  }

  public logout() {
    this.assertRendered();
    this.pymControl!.sendMessage("logout");
  }

  public remove() {
    this.assertRendered();
    return this.pymControl!.remove();
  }

  public render() {
    if (this.pymControl) {
      throw new Error("Stream Embed already rendered");
    }
    const streamDecorators: ReadonlyArray<Decorator> = [
      withIOSSafariWidthWorkaround,
      withAutoHeight,
      withClickEvent,
      withSetCommentID,
      withEventEmitter(this.config.eventEmitter),
      withPymStorage(localStorage, "localStorage"),
      withPymStorage(sessionStorage, "sessionStorage"),
    ];

    const query = qs.stringify({
      assetID: this.config.assetID,
      assetURL: this.config.assetURL,
      commentID: this.config.commentID,
    });
    const url = `${ensureEndSlash(this.config.rootURL)}stream.html?${query}`;
    this.pymControl = new PymControl({
      id: this.config.id,
      title: this.config.title,
      decorators: streamDecorators,
      url,
    });
  }
}

export default function createStreamEmbed(config: StreamConfig) {
  return new StreamEmbed(config);
}
