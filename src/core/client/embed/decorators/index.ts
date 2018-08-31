import pym from "pym.js";

export type CleanupCallback = () => void;
export type Decorator = (pym: pym.Parent) => CleanupCallback | void;
export { default as withAutoHeight } from "./withAutoHeight";
export { default as withClickEvent } from "./withClickEvent";
export { default as withSetCommentID } from "./withSetCommentID";
export { default as withEventEmitter } from "./withEventEmitter";
export { default as withPymStorage } from "./withPymStorage";
export {
  default as withIOSSafariWidthWorkaround,
} from "./withIOSSafariWidthWorkaround";
