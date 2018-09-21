import { EventEmitter2 } from "eventemitter2";
import qs from "query-string";

import { default as create, StreamEmbed } from "./StreamEmbed";

export interface Config {
  assetID?: string;
  assetURL?: string;
  commentID?: string;
  rootURL?: string;
  id?: string;
  autoRender?: boolean;
  events?: (eventEmitter: EventEmitter2) => void;
}

function getLocationOrigin() {
  return (
    location.origin ||
    `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ""
    }`
  );
}

function resolveAssetURL() {
  const canonical = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement;
  if (canonical) {
    return canonical.href;
  }

  // tslint:disable-next-line:no-console
  console.warn(
    "This page does not include a canonical link tag. Talk has inferred this asset_url from the window object. Query params have been stripped, which may cause a single thread to be present across multiple pages."
  );

  return getLocationOrigin() + window.location.pathname;
}

export function createStreamEmbed(config: Config): StreamEmbed {
  // Parse query params
  const query = qs.parse(location.search);
  const eventEmitter = new EventEmitter2({ wildcard: true });

  if (config.events) {
    config.events(eventEmitter);
  }

  return create({
    title: "Talk Embed Stream",
    assetID: config.assetID || query.assetID,
    assetURL: config.assetURL || resolveAssetURL(),
    commentID: config.commentID || query.commentID,
    id: config.id || "talk-embed-stream",
    rootURL: config.rootURL || getLocationOrigin(),
    autoRender: config.autoRender,
    eventEmitter,
  });
}
