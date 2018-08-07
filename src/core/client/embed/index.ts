import { EventEmitter2 } from "eventemitter2";
import qs from "query-string";

import createStreamInterface from "./Stream";

export interface Config {
  assetID?: string;
  assetURL?: string;
  commentID?: string;
  rootURL?: string;
  id?: string;
  events?: (eventEmitter: EventEmitter2) => void;
}

export function render(config: Config = {}) {
  // Parse query params
  const query = qs.parse(location.search);
  const eventEmitter = new EventEmitter2({ wildcard: true });

  if (config.events) {
    config.events(eventEmitter);
  }

  return createStreamInterface({
    assetID: config.assetID || query.assetID,
    assetURL: config.assetURL || query.assetURL,
    commentID: config.commentID || query.commentID,
    id: config.id || "talk-embed-stream",
    rootURL: config.rootURL || location.origin,
    eventEmitter,
  });
}
