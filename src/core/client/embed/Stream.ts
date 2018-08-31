import { EventEmitter2 } from "eventemitter2";
import qs from "query-string";

import {
  Decorator,
  withAutoHeight,
  withClickEvent,
  withEventEmitter,
  withIOSSafariWidthWorkaround,
  withPymStorage,
  withSetCommentID,
} from "./decorators";
import PymControl from "./PymControl";
import { ensureEndSlash } from "./utils";

interface CreatePymControlConfig {
  assetID?: string;
  assetURL?: string;
  commentID?: string;
  title?: string;
  eventEmitter: EventEmitter2;
  id: string;
  rootURL: string;
}

export function createPymControl(config: CreatePymControlConfig) {
  const streamDecorators: ReadonlyArray<Decorator> = [
    withIOSSafariWidthWorkaround,
    withAutoHeight,
    withClickEvent,
    withSetCommentID,
    withEventEmitter(config.eventEmitter),
    withPymStorage(localStorage, "localStorage"),
    withPymStorage(sessionStorage, "sessionStorage"),
  ];

  const query = qs.stringify({
    assetID: config.assetID,
    assetURL: config.assetURL,
    commentID: config.commentID,
  });
  const url = `${ensureEndSlash(config.rootURL)}stream.html?${query}`;
  return new PymControl({
    id: config.id,
    title: config.title || "Talk Embed Stream",
    decorators: streamDecorators,
    url,
  });
}

type EventCallback = (data: any) => void;

export function createStreamInterface(
  control: PymControl,
  eventEmitter: EventEmitter2
) {
  return {
    on(eventName: string, callback: EventCallback) {
      return eventEmitter.on(eventName, callback);
    },
    off(eventName: string, callback: EventCallback) {
      return eventEmitter.off(eventName, callback);
    },
    login(token: string) {
      control.sendMessage("login", token);
    },
    logout() {
      control.sendMessage("logout");
    },
    remove() {
      return control.remove();
    },
  };
}

export type StreamInterface = ReturnType<typeof createStreamInterface>;

export interface CreateConfig {
  assetID?: string;
  assetURL?: string;
  commentID?: string;
  title?: string;
  eventEmitter: EventEmitter2;
  id: string;
  rootURL: string;
}
export default function create(config: CreateConfig) {
  return createStreamInterface(createPymControl(config), config.eventEmitter);
}
