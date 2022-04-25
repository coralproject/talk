import { EventEmitter2 } from "eventemitter2";

import { parseQuery } from "coral-common/utils";
import { getCurrentScriptOrigin } from "coral-framework/helpers";
import resolveStoryURL from "coral-framework/helpers/resolveStoryURL";

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

  /** Allow setting className of embed container */
  containerClassName?: string;
  /** @deprecated use new option: `containerClassName` */
  bodyClassName?: string;

  customCSSURL?: string;
  customFontsCSSURL?: string;
  disableDefaultFonts?: boolean;
  amp?: boolean;
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

  if (config.bodyClassName) {
    // eslint-disable-next-line no-console
    console.warn(
      "Coral: `bodyClassName` has been deprecated. Use `containerClassName` instead."
    );
  }

  return new StreamEmbed({
    id: config.id || "coral-embed-stream",
    storyID: config.storyID || query.storyID,
    storyURL: config.storyURL || query.storyURL || resolveStoryURL(window),
    storyMode: config.storyMode || undefined,
    commentID: config.commentID || query.commentID,
    rootURL: config.rootURL || getCurrentScriptOrigin(),
    eventEmitter: embedEventEmitter,
    accessToken: config.accessToken,
    customCSSURL: config.customCSSURL,
    customFontsCSSURL: config.customFontsCSSURL,
    disableDefaultFonts: config.disableDefaultFonts,
    refreshAccessToken: config.refreshAccessToken,
    amp: config.amp,
    autoRender: config.autoRender,
    enableDeprecatedEvents: config.enableDeprecatedEvents,
    containerClassName: config.containerClassName || config.bodyClassName,
  });
}
