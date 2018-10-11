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
import onIntersect from "./onIntersect";
import PymControl, {
  defaultPymControlFactory,
  PymControlFactory,
} from "./PymControl";
import { ensureNoEndSlash } from "./utils";

// This is importing the url helper from the framework using a relative path
// import because the ts paths are not configured to use the framework for this
// target.
// TODO: (wyattjoh) replace with import from framework when we include it in the config.
import urls from "../framework/helpers/urls";

export interface StreamEmbedConfig {
  assetID?: string;
  assetURL?: string;
  commentID?: string;
  autoRender?: boolean;
  title: string;
  eventEmitter: EventEmitter2;
  id: string;
  rootURL: string;
}

export class StreamEmbed {
  private config: StreamEmbedConfig;
  private pymControl?: PymControl;
  private pymControlFactory: PymControlFactory;

  constructor(
    config: StreamEmbedConfig,
    pymControlFactory = defaultPymControlFactory
  ) {
    this.config = config;
    this.pymControlFactory = pymControlFactory;
    if (config.commentID) {
      // Delay emit of `showPermalink` event to allow
      // user enough time to setup event listeners.
      setTimeout(() => config.eventEmitter.emit("showPermalink"), 0);
    }
    if (config.autoRender) {
      if (config.commentID) {
        this.render();
      } else {
        onIntersect(document.getElementById(config.id)!, () => {
          if (!this.rendered) {
            this.render();
          }
        });
      }
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
    this.pymControl!.remove();
    this.pymControl = undefined;
  }

  get rendered() {
    return !!this.pymControl;
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

    const url = `${ensureNoEndSlash(this.config.rootURL)}${urls.embed.stream}${
      query ? `?${query}` : ""
    }`;
    this.pymControl = this.pymControlFactory({
      id: this.config.id,
      title: this.config.title,
      decorators: streamDecorators,
      url,
    });
  }
}

export default function createStreamEmbed(config: StreamEmbedConfig) {
  return new StreamEmbed(config);
}
