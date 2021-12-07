import { EventEmitter2 } from "eventemitter2";

import { RefreshAccessTokenCallback } from "./Coral";
import {
  withAMPHeight,
  withEventEmitter,
  withLiveCommentCount,
  withSetCommentID,
} from "./decorators";
import injectCountScriptIfNeeded from "./injectCountScriptIfNeeded";
import onIntersect, { OnIntersectCancellation } from "./onIntersect";

export interface StreamEmbedConfig {
  storyID?: string;
  storyURL?: string;
  storyMode?: string;
  commentID?: string;
  autoRender?: boolean;
  eventEmitter: EventEmitter2;
  id: string;
  rootURL: string;
  accessToken?: string;
  bodyClassName?: string;
  enableDeprecatedEvents?: boolean;
  customCSSURL?: string;
  refreshAccessToken?: RefreshAccessTokenCallback;
  amp?: boolean;
  graphQLSubscriptionURI?: string;
}

export class StreamEmbed {
  /**
   * eventEmitter provides an interface to events emitted by Coral.
   */
  private readonly embedEventEmitter: EventEmitter2;
  /**
   * eventEmitter provides an interface to events emitted by Coral.
   */
  private readonly streamEventEmitter: EventEmitter2;

  private ready = false;
  private _rendered = false;
  private clearAutoRender: OnIntersectCancellation | null = null;
  private config: StreamEmbedConfig;
  private element: HTMLElement;

  constructor(config: StreamEmbedConfig) {
    this.config = config;
    const findElement = document.getElementById(config.id);
    if (!findElement) {
      throw new Error(`element ${config.id} was not found`);
    }
    this.element = findElement;

    if (config.bodyClassName) {
      this.element.className = this.element.className
        ? `${this.element.className} ${config.bodyClassName}`
        : config.bodyClassName;
    }

    this.streamEventEmitter = new EventEmitter2({
      wildcard: true,
      maxListeners: 1000,
      delimiter: ".",
    });

    // Save a reference to the event emitter used by the application.
    this.embedEventEmitter = config.eventEmitter;

    // When the config emits that we're ready, then mark us as ready.
    this.streamEventEmitter.once("ready", () => {
      this.ready = true;
    });

    withSetCommentID(this.streamEventEmitter);
    withLiveCommentCount(this.streamEventEmitter);
    withEventEmitter(
      this.streamEventEmitter,
      this.embedEventEmitter,
      config.enableDeprecatedEvents
    );
    if (config.amp) {
      withAMPHeight(this.streamEventEmitter);
    }

    // Detect if comment count injection is needed and add the count script.
    injectCountScriptIfNeeded(config.rootURL);

    if (config.commentID) {
      // Delay emit of `showPermalink` event to allow user enough time to setup
      // event listeners.
      setTimeout(() => this.embedEventEmitter.emit("showPermalink"), 0);
    }

    if (config.autoRender) {
      if (config.commentID) {
        // If we are going to auto-render this comment stream and we're on a
        // specific comment, render the stream now so we can auto-scroll the
        // user to the embed.
        this.render();
      } else {
        // When the element is in view, then render the embed.
        this.clearAutoRender = onIntersect(
          this.element,
          () => {
            this.clearAutoRender = null;
            this.render();
          },
          {
            rootMargin: "100px",
            threshold: 1.0,
          }
        );
      }
    }
  }

  public on(eventName: string, callback: (data: any) => void) {
    return this.embedEventEmitter.on(eventName, callback);
  }

  public off(eventName: string, callback: (data: any) => void) {
    return this.embedEventEmitter.off(eventName, callback);
  }

  public login(token: string) {
    // If we aren't ready yet, once we are, send the login message.
    if (!this.ready) {
      this.streamEventEmitter.once("ready", () => {
        this.streamEventEmitter.emit("embed.login", token);
      });
      return;
    }

    this.streamEventEmitter.emit("embed.login", token);
  }

  public logout() {
    // If we aren't ready yet, once we are, send the logout message.
    if (!this.ready) {
      this.streamEventEmitter.once("ready", () => {
        this.streamEventEmitter.emit("embed.logout");
      });
      return;
    }

    this.streamEventEmitter.emit("embed.logout");
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
    if (!this._rendered) {
      throw new Error("instance not mounted");
    }

    if ((!window as any).CoralStream?.attach) {
      throw new Error("CoralStream Script not loaded");
    }
    (window as any).CoralStream.remove(this.element);
    this._rendered = false;
  }

  public get rendered() {
    return this._rendered;
  }

  private attach() {
    if (!(window as any).CoralStream?.attach) {
      throw new Error("CoralStream Script not loaded");
    }
    (window as any).CoralStream.attach({
      storyID: this.config.storyID,
      storyURL: this.config.storyURL,
      storyMode: this.config.storyMode,
      commentID: this.config.commentID,
      rootURL: this.config.rootURL,
      eventEmitter: this.streamEventEmitter,
      accessToken: this.config.accessToken,
      customCSSURL: this.config.customCSSURL,
      refreshAccessToken: this.config.refreshAccessToken,
      amp: this.config.amp,
      element: this.element,
      graphQLSubscriptionURI: this.config.graphQLSubscriptionURI,
      /* autoRender: config.autoRender,
      enableDeprecatedEvents: config.enableDeprecatedEvents,*/
    });
    this._rendered = true;
  }

  public render() {
    // The control has already been rendered, so do nothing.
    if (this._rendered) {
      return;
    }
    if ((window as any).CoralStream) {
      this.attach();
      return;
    }
    const script = document.createElement("script");
    script.onload = () => {
      this.attach();
    };
    script.src = "/assets/js/stream2.js";
    document.head.appendChild(script);
  }
}
