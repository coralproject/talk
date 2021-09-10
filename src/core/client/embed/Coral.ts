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
}

export function createStreamEmbed(config: Config): StreamEmbed {
  // Parse query params
  const query = parseQuery(location.search);
  const eventEmitter = new EventEmitter2({ wildcard: true });

  if (config.events) {
    config.events(eventEmitter);
  }

  return new StreamEmbed({
    title: "Coral Embed Stream",
    storyID: config.storyID || query.storyID,
    storyURL: config.storyURL || query.storyURL || resolveStoryURL(window),
    storyMode: config.storyMode || undefined,
    commentID: config.commentID || query.commentID,
    id: config.id || "coral-embed-stream",
    rootURL: config.rootURL || getLocationOrigin(window),
    autoRender: config.autoRender,
    eventEmitter,
    accessToken: config.accessToken,
    bodyClassName: config.bodyClassName,
    enableDeprecatedEvents: config.enableDeprecatedEvents,
    customCSSURL: config.customCSSURL,
    refreshAccessToken: config.refreshAccessToken,
    amp: config.amp,
  });
}
