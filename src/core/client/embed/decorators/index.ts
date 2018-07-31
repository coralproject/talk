import pym from "pym.js";

export type CleanupCallback = () => void;
export type Decorator = (pym: pym.Parent) => CleanupCallback | void;
export { default as withAutoHeight } from "./withAutoHeight";
export { default as withClickOutside } from "./withClickOutside";
export { default as withCommentID } from "./withCommentID";
export { default as withEventEmitter } from "./withEventEmitter";
export {
  default as withIOSSafariWidthWorkaround,
} from "./withIOSSafariWidthWorkaround";
