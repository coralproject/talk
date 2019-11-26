import { EventEmitter2 } from "eventemitter2";

import { parseQuery } from "coral-common/utils";
import resolveStoryURL from "coral-framework/helpers/resolveStoryURL";
import getLocationOrigin from "coral-framework/utils/getLocationOrigin";

import { default as create, StreamEmbed } from "./StreamEmbed";

export interface Config {
  storyID?: string;
  storyURL?: string;
  commentID?: string;
  rootURL?: string;
  id?: string;
  autoRender?: boolean;
  events?: (eventEmitter: EventEmitter2) => void;
  accessToken?: string;
  enableDeprecatedEvents?: boolean;
}

export function createStreamEmbed(config: Config): StreamEmbed {
  // Parse query params
  const query = parseQuery(location.search);
  const eventEmitter = new EventEmitter2({ wildcard: true });

  if (config.events) {
    config.events(eventEmitter);
  }

  return create({
    title: "Coral Embed Stream",
    storyID: config.storyID || query.storyID,
    storyURL: config.storyURL || resolveStoryURL(),
    commentID: config.commentID || query.commentID,
    id: config.id || "coral-embed-stream",
    rootURL: config.rootURL || getLocationOrigin(),
    autoRender: config.autoRender,
    eventEmitter,
    accessToken: config.accessToken,
    enableDeprecatedEvents: config.enableDeprecatedEvents,
  });
}
