import { EventEmitter2 } from "eventemitter2";

import { parseQuery } from "coral-common/utils";
import resolveStoryURL from "coral-framework/helpers/resolveStoryURL";
import getLocationOrigin from "coral-framework/utils/getLocationOrigin";

import { StreamEmbed } from "./StreamEmbed";

export type RefreshAccessTokenCallback = (
  nextAccessToken: (token: string) => void
) => void;

export interface Config {
  storyID?: string;
  storyURL?: string;
  storyMode?: string;
  commentID?: string;
  rootURL?: string;
  id?: string;
  autoRender?: boolean;
  events?: (eventEmitter: EventEmitter2) => void;
  accessToken?: string;

  /**
   * refreshAccessToken is called to obtain a new access token when the current one has expired.
   * A parameter `nextAccessToken` is passed as the first argument that should be called with the
   * next access token.
   */
  refreshAccessToken?: RefreshAccessTokenCallback;
  enableDeprecatedEvents?: boolean;

  /** Allow setting className of body tag inside iframe */
  bodyClassName?: string;
  customCSSURL?: string;
  amp?: boolean;

  graphQLSubscriptionURI?: string;
}

export function createStreamEmbed(config: Config): StreamEmbed {
  // Parse query params
  const query = parseQuery(location.search);
  const embedEventEmitter = new EventEmitter2({
    wildcard: true,
    delimiter: ".",
  });

  if (config.events) {
    config.events(embedEventEmitter);
  }

  return new StreamEmbed({
    id: config.id || "coral-embed-stream",
    storyID: config.storyID || query.storyID,
    storyURL: config.storyURL || query.storyURL || resolveStoryURL(window),
    storyMode: config.storyMode || undefined,
    commentID: config.commentID || query.commentID,
    rootURL: config.rootURL || getLocationOrigin(window),
    eventEmitter: embedEventEmitter,
    accessToken: config.accessToken,
    customCSSURL: config.customCSSURL,
    refreshAccessToken: config.refreshAccessToken,
    amp: config.amp,
    graphQLSubscriptionURI: config.graphQLSubscriptionURI,
    autoRender: config.autoRender,
    enableDeprecatedEvents: config.enableDeprecatedEvents,
  });
}

export function createStreamEmbed2(config: Config) {
  // Parse query params
  const query = parseQuery(location.search);
  const embedEventEmitter = new EventEmitter2({
    wildcard: true,
  });
  const streamEventEmitter = new EventEmitter2({
    wildcard: true,
    maxListeners: 1000,
    delimiter: ".",
  });

  if (config.events) {
    config.events(embedEventEmitter);
  }

  const id = config.id || "coral-embed-stream";
  const element = document.getElementById(id);
  if (!element) {
    // eslint-disable-next-line no-console
    console.error(`Element to render Coral Stream not found: ${id}`);
    return;
  }
  if (config.bodyClassName) {
    element.className = element.className
      ? `${element.className} ${config.bodyClassName}`
      : config.bodyClassName;
  }
  const script = document.createElement("script");
  script.onload = function () {
    (window as any).CoralStream.attach({
      storyID: config.storyID || query.storyID,
      storyURL: config.storyURL || query.storyURL || resolveStoryURL(window),
      storyMode: config.storyMode || undefined,
      commentID: config.commentID || query.commentID,
      rootURL: config.rootURL || getLocationOrigin(window),
      eventEmitter: streamEventEmitter,
      accessToken: config.accessToken,
      customCSSURL: config.customCSSURL,
      refreshAccessToken: config.refreshAccessToken,
      amp: config.amp,
      element: document.getElementById(id),
      graphQLSubscriptionURI: config.graphQLSubscriptionURI,
      /* autoRender: config.autoRender,
      enableDeprecatedEvents: config.enableDeprecatedEvents,*/
    });
  };
  script.src = "/assets/js/stream2.js";
  document.head.appendChild(script);
}
