import pym from "pym.js";

import { PostMessageService } from "coral-framework/lib/postMessage";

export type CleanupCallback = () => void;
export type DecoratorLegacy = (
  pym: pym.Parent,
  postMessage: PostMessageService
) => CleanupCallback | void;

