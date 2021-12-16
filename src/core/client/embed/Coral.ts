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
  customFontsCSSURL?: string;
  disableDefaultFonts?: boolean;
  amp?: boolean;
}

let staticURI = "/";

/** This is called by the stream bundle to get the public path. */
export function getStaticURI() {
  return staticURI;
}

/** Set static url for webpack. Should be called as soon as we know it. */
export function setStaticURI(uri: string) {
  /* @ts-ignore */
  __webpack_public_path__ = uri;
  staticURI = uri;
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
    customFontsCSSURL: config.customFontsCSSURL,
    disableDefaultFonts: config.disableDefaultFonts,
    refreshAccessToken: config.refreshAccessToken,
    amp: config.amp,
    autoRender: config.autoRender,
    enableDeprecatedEvents: config.enableDeprecatedEvents,
  });
}
