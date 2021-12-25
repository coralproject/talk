import { EmbedBootstrapConfig } from "coral-common/config";
import { PolyfillConfig } from "coral-framework/helpers/injectConditionalPolyfills";
import { getBrowserInfo } from "coral-framework/lib/browserInfo";
import { EventEmitter2 } from "eventemitter2";

import { RefreshAccessTokenCallback, setStaticURI } from "./Coral";
import {
  withAMPHeight,
  withEventEmitter,
  withLiveCommentCount,
  withSetCommentID,
} from "./decorators";
import injectCountScriptIfNeeded from "./injectCountScriptIfNeeded";
import onIntersect, { OnIntersectCancellation } from "./onIntersect";

/** When loading /embed/bootstrap retry x times */
const LOAD_BOOTSTRAP_RETRY_ATTEMPTS =
  process.env.NODE_ENV === "production" ? 3 : 20;
/** Initial delay before a retry */
const LOAD_BOOTSTRAP_RETRY_DELAY = 2000;
/** Multiplier for each attempt more */
const LOAD_BOOTSTRAP_RETRY_DELAY_MULTIPLIER =
  process.env.NODE_ENV === "production" ? 2000 : 0;

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
  containerClassName?: string;
  enableDeprecatedEvents?: boolean;
  disableDefaultFonts?: boolean;
  customFontsCSSURL?: string;
  customCSSURL?: string;
  refreshAccessToken?: RefreshAccessTokenCallback;
  amp?: boolean;
  graphQLSubscriptionURI?: string;
  polyfills?: PolyfillConfig;
}

export class StreamEmbed {
  /**
   * Every interval rounded to this value in ms will be passed when creating the
   * stream embed iframe to ensure that it is loaded fresh.
   */
  private readonly requestExpiryInterval = 15 * 60 * 1000; // 15 minutes

  // Add the current date rounded to the nearest `this.expiry` to ensure
  // that we cache bust. We already send `Cache-Control: no-store` but
  // sometimes mobile browsers will not make the HTTP request when using the
  // back button. This can be removed when we can reliably provide multiple
  // versions of files via storage solutions.
  private readonly ts =
    Math.round(Date.now() / this.requestExpiryInterval) *
    this.requestExpiryInterval;

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
  private _assetsPreloaded = false;
  private clearAutoRender: OnIntersectCancellation | null = null;
  private clearAutoPreload: OnIntersectCancellation | null = null;
  private config: StreamEmbedConfig;
  private element: HTMLElement;
  private boostrapConfig?: EmbedBootstrapConfig;
  private cssAssets: string[];
  private jsAssets: string[];
  private onBootstrapConfigLoaded: Array<() => void> = [];
  private customCSSURL?: string;
  private customFontsCSSURL?: string;
  private disableDefaultFonts?: boolean;

  constructor(config: StreamEmbedConfig) {
    this.config = config;
    const findElement = document.getElementById(config.id);
    if (!findElement) {
      throw new Error(`element ${config.id} was not found`);
    }
    this.element = findElement;

    // Load bootstrap config from server.
    this.loadBootstrapConfig();

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
      if (
        config.commentID ||
        !getBrowserInfo(window).supports.intersectionObserver
      ) {
        // If we are going to auto-render this comment stream and we're on a
        // specific comment, render the stream now so we can auto-scroll the
        // user to the embed.
        this.render();
      } else {
        // Preload assets when nearing embed.
        this.clearAutoPreload = onIntersect(
          this.element,
          () => {
            // Boostrap config is still loading, we'll wait and then preload.
            if (!this.boostrapConfig) {
              this.runAfterBootstrapConfigLoaded(() => {
                this.preloadAssets();
              });
              return;
            }
            this.preloadAssets();
          },
          {
            rootMargin: "1200px",
            threshold: 1.0,
          }
        );
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

  /** Queue calledback to be called after bootstrap config has loaded */
  private runAfterBootstrapConfigLoaded(cb: () => void) {
    this.onBootstrapConfigLoaded.push(cb);
  }

  /** This is called when BootstrapConfig ist Loaded */
  private onBootstrapConfigLoad(config: EmbedBootstrapConfig) {
    this.boostrapConfig = config;

    this.customCSSURL =
      this.config.customCSSURL || this.boostrapConfig.customCSSURL;
    this.customFontsCSSURL =
      this.config.customFontsCSSURL || this.boostrapConfig.customFontsCSSURL;
    this.disableDefaultFonts =
      this.config.disableDefaultFonts ||
      this.boostrapConfig.disableDefaultFonts;

    // Set webpacks static uri.
    setStaticURI(config.staticConfig.staticURI);

    // Parse css and js assets and incorporate staticURI.
    const prefix = config.staticConfig.staticURI
      ? config.staticConfig.staticURI
      : "";
    this.cssAssets = [...config.assets.css].map(
      (a) => prefix + `${a.src}?ts=${this.ts}`
    );
    this.jsAssets = config.assets.js.map(
      (a) => prefix + `${a.src}?ts=${this.ts}`
    );

    // Call any pending callbacks that were waiting for the bootstrap config to be loaded.
    if (this.onBootstrapConfigLoaded) {
      this.onBootstrapConfigLoaded.forEach((cb) => cb());
      this.onBootstrapConfigLoaded = [];
    }
  }

  /** Loads the boostrap config */
  private loadBootstrapConfig(attempt = 0) {
    const loadBootstrapConfigRef = (...args: any[]) =>
      this.loadBootstrapConfig(...args);
    const req = new XMLHttpRequest();
    const runOnBootstrapLoad = (config: EmbedBootstrapConfig) =>
      this.onBootstrapConfigLoad(config);
    req.addEventListener("load", function () {
      if (this.status !== 200) {
        if (attempt < LOAD_BOOTSTRAP_RETRY_ATTEMPTS) {
          // Retry!
          setTimeout(() => {
            loadBootstrapConfigRef(attempt + 1);
          }, LOAD_BOOTSTRAP_RETRY_DELAY + LOAD_BOOTSTRAP_RETRY_DELAY_MULTIPLIER * attempt);
        }
        throw new Error("Loading bootstrap config failed");
      }
      runOnBootstrapLoad(JSON.parse(this.responseText));
    });
    req.open("GET", `${this.config.rootURL}/embed/bootstrap`);
    req.setRequestHeader("Content-Type", "application/json");
    req.send();
  }

  private preloadAssets() {
    if (this._assetsPreloaded) {
      return;
    }
    this._assetsPreloaded = true;

    if (this.clearAutoPreload) {
      this.clearAutoPreload();
      this.clearAutoPreload = null;
    }

    this._preloadCSSAssets();
    this._preloadJSAssets();
  }

  private _preloadCSSAssets() {
    const assets: string[] = [];
    if (
      this.boostrapConfig &&
      this.boostrapConfig.defaultFontsCSSURL &&
      !this.disableDefaultFonts
    ) {
      assets.push(this.boostrapConfig.defaultFontsCSSURL);
    }
    if (this.customFontsCSSURL) {
      assets.push(this.customFontsCSSURL);
    }
    if (this.customCSSURL) {
      assets.push(this.customCSSURL);
    }
    assets.push(...this.cssAssets);

    assets.forEach((asset) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = asset;
      link.as = "style";
      document.head.appendChild(link);
    });
  }

  private _preloadJSAssets() {
    this.jsAssets.forEach((asset) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = asset;
      link.as = "script";
      document.head.appendChild(link);
    });
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
    if (!this.boostrapConfig) {
      throw new Error("Bootstrap config not loaded");
    }
    (window as any).CoralStream.attach({
      storyID: this.config.storyID,
      storyURL: this.config.storyURL,
      storyMode: this.config.storyMode,
      commentID: this.config.commentID,
      rootURL: this.config.rootURL,
      eventEmitter: this.streamEventEmitter,
      accessToken: this.config.accessToken,
      cssAssets: this.cssAssets,
      refreshAccessToken: this.config.refreshAccessToken,
      amp: this.config.amp,
      element: this.element,
      graphQLSubscriptionURI: this.config.graphQLSubscriptionURI,
      staticConfig: this.boostrapConfig.staticConfig,
      customCSSURL: this.customCSSURL,
      customFontsCSSURL: this.customFontsCSSURL,
      disableDefaultFonts: this.disableDefaultFonts,
      locale: this.boostrapConfig.locale,
      containerClassName: this.config.containerClassName,
      polyfills: this.config.polyfills,
      // Add the version to the query string to ensure that every new version of
      // the stream will cause stream pages to cache bust.
      version: process.env.TALK_VERSION ? process.env.TALK_VERSION : "dev",
    });
  }

  public render() {
    // The control has already been rendered, so do nothing.
    if (this._rendered) {
      return;
    }
    // Boostrap config is still loading, we'll wait and then render.
    if (!this.boostrapConfig) {
      this.runAfterBootstrapConfigLoaded(() => {
        this.render();
      });
      return;
    }

    // Make sure we preload our assets if not already done.
    this.preloadAssets();

    // Mark as rendered.
    this._rendered = true;

    // Load script and attach stream.
    if ((window as any).CoralStream) {
      this.attach();
      return;
    }
    const script = document.createElement("script");
    script.onload = () => {
      this.attach();
    };

    // Find stream script from the js assets parsed from the bootstrap config.
    const streamScript = this.jsAssets.find((s) =>
      s.includes("assets/js/stream.js")
    );
    if (!streamScript) {
      throw new Error("Stream script not found in manifest");
    }
    script.src = streamScript;
    document.head.appendChild(script);
  }
}
