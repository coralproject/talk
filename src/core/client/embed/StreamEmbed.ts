import { EventEmitter2 } from "eventemitter2";

import { stringifyQuery } from "coral-common/utils";
import ensureNoEndSlash from "coral-common/utils/ensureNoEndSlash";
import urls from "coral-framework/helpers/urls";

import { RefreshAccessTokenCallback } from "./Coral";
import {
  Decorator,
  withAutoHeight,
  withClickEvent,
  withConfig,
  withEventEmitter,
  withIndexedDBStorage,
  withIOSSafariWidthWorkaround,
  withKeypressEvent,
  withLiveCommentCount,
  withPostMessageStorage,
  withSetCommentID,
} from "./decorators";
import withRefreshAccessToken from "./decorators/withRefreshAccessToken";
import { FrameControl, FrameControlFactory } from "./FrameControl";
import injectCountScriptIfNeeded from "./injectCountScriptIfNeeded";
import onIntersect, { OnIntersectCancellation } from "./onIntersect";
import { defaultPymControlFactory } from "./PymFrameControl";
import { coerceStorage } from "./utils";

export interface StreamEmbedConfig {
  storyID?: string;
  storyURL?: string;
  storyMode?: string;
  commentID?: string;
  autoRender?: boolean;
  title: string;
  eventEmitter: EventEmitter2;
  id: string;
  rootURL: string;
  accessToken?: string;
  bodyClassName?: string;
  enableDeprecatedEvents?: boolean;
  customCSSURL?: string;
  refreshAccessToken?: RefreshAccessTokenCallback;
  amp?: boolean;
}

export class StreamEmbed {
  /**
   * Every interval rounded to this value in ms will be passed when creating the
   * stream embed iframe to ensure that it is loaded fresh.
   */
  private readonly requestExpiryInterval = 15 * 60 * 1000; // 15 minutes

  /**
   * control provides an interface to the iFrame controller.
   */
  private readonly control: FrameControl;

  /**
   * eventEmitter provides an interface to events emitted by Coral.
   */
  private readonly eventEmitter: EventEmitter2;

  private ready = false;
  private clearAutoRender: OnIntersectCancellation | null = null;

  constructor(
    config: StreamEmbedConfig,
    controlFactory: FrameControlFactory = defaultPymControlFactory
  ) {
    const element = document.getElementById(config.id);
    if (!element) {
      throw new Error(`element ${config.id} was not found`);
    }

    // Save a reference to the event emitter used by the application.
    this.eventEmitter = config.eventEmitter;

    // When the config emits that we're ready, then mark us as ready.
    config.eventEmitter.once("ready", () => {
      this.ready = true;
    });

    // Create the decorators that will be used by the controller.
    const decorators: ReadonlyArray<Decorator> = [
      withIOSSafariWidthWorkaround,
      withAutoHeight(!!config.amp),
      withClickEvent,
      withSetCommentID,
      withEventEmitter(config.eventEmitter, config.enableDeprecatedEvents),
      withLiveCommentCount(config.eventEmitter),
      withPostMessageStorage(coerceStorage("localStorage"), "localStorage"),
      withPostMessageStorage(coerceStorage("sessionStorage"), "sessionStorage"),
      withIndexedDBStorage(),
      withConfig({
        accessToken: config.accessToken,
        bodyClassName: config.bodyClassName,
        version: process.env.TALK_VERSION,
      }),
      withKeypressEvent,
      withRefreshAccessToken(config.refreshAccessToken),
    ];

    const query = stringifyQuery({
      storyID: config.storyID,
      storyURL: config.storyURL,
      storyMode: config.storyMode,
      commentID: config.commentID,
      customCSSURL: config.customCSSURL,

      // Add the version to the query string to ensure that every new version of
      // the stream will cause stream pages to cache bust.
      v: process.env.TALK_VERSION ? process.env.TALK_VERSION : "dev",

      // Add the current date rounded to the nearest `this.expiry` to ensure
      // that we cache bust. We already send `Cache-Control: no-store` but
      // sometimes mobile browsers will not make the HTTP request when using the
      // back button. This can be removed when we can reliably provide multiple
      // versions of files via storage solutions.
      ts:
        Math.round(Date.now() / this.requestExpiryInterval) *
        this.requestExpiryInterval,
    });

    // Compose the stream URL for the iframe.
    const streamURL = ensureNoEndSlash(config.rootURL) + urls.embed.stream;
    const url = `${streamURL}?${query}`;

    // Create the controller.
    this.control = controlFactory({
      id: config.id,
      title: config.title,
      decorators,
      url,
    });

    // Detect if comment count injection is needed and add the count script.
    injectCountScriptIfNeeded(config.rootURL);

    if (config.commentID) {
      // Delay emit of `showPermalink` event to allow user enough time to setup
      // event listeners.
      setTimeout(() => config.eventEmitter.emit("showPermalink"), 0);
    }

    if (config.autoRender) {
      if (config.commentID) {
        // If we are going to auto-render this comment stream and we're on a
        // specific comment, render the stream now so we can auto-scroll the
        // user to the embed.
        this.render();
      } else {
        // When the element is in view, then render the embed.
        this.clearAutoRender = onIntersect(element, () => {
          this.clearAutoRender = null;
          this.render();
        });
      }
    }
  }

  public on(eventName: string, callback: (data: any) => void) {
    return this.eventEmitter.on(eventName, callback);
  }

  public off(eventName: string, callback: (data: any) => void) {
    return this.eventEmitter.off(eventName, callback);
  }

  public login(token: string) {
    // If we aren't ready yet, once we are, send the login message.
    if (!this.ready) {
      this.eventEmitter.once("ready", () => {
        this.control.sendMessage("login", token);
      });
      return;
    }

    this.control.sendMessage("login", token);
  }

  public logout() {
    // If we aren't ready yet, once we are, send the logout message.
    if (!this.ready) {
      this.eventEmitter.once("ready", () => {
        this.control.sendMessage("logout");
      });
      return;
    }

    this.control.sendMessage("logout");
  }

  public remove() {
    // If auto render was enabled it means that the stream has not rendered yet,
    // so just cancel the auto-render.
    if (this.clearAutoRender) {
      this.clearAutoRender();
      this.clearAutoRender = null;
      return;
    }

    // The control hasn't rendered yet, so do nothing.
    if (!this.control.rendered) {
      throw new Error("instance not mounted");
    }

    this.control.remove();
  }

  public get rendered() {
    return this.control.rendered;
  }

  public render() {
    // The control has already been rendered, so do nothing.
    if (this.control.rendered) {
      return;
    }

    this.control.render();
  }
}
