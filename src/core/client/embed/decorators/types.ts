import pym from "pym.js";

import { PostMessageService } from "coral-framework/lib/postMessage";

export type CleanupCallback = () => void;
export type Decorator = (
  pym: pym.Parent,
  postMessage: PostMessageService
) => CleanupCallback | void;
