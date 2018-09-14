import { EventEmitter2 } from "eventemitter2";
import qs from "query-string";

import { default as create, StreamEmbed } from "./StreamEmbed";

export interface Config {
  assetID?: string;
  assetURL?: string;
  commentID?: string;
  rootURL?: string;
  id?: string;
  events?: (eventEmitter: EventEmitter2) => void;
}

export function createStreamEmbed(config: Config): StreamEmbed {
  // Parse query params
  const query = qs.parse(location.search);
  const eventEmitter = new EventEmitter2({ wildcard: true });

  if (config.events) {
    config.events(eventEmitter);
  }

  return create({
    assetID: config.assetID || query.assetID,
    assetURL: config.assetURL || query.assetURL,
    commentID: config.commentID || query.commentID,
    id: config.id || "talk-embed-stream",
    rootURL: config.rootURL || location.origin,
    eventEmitter,
  });
}
