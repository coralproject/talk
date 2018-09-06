import pym from "pym.js";

export type CleanupCallback = () => void;
export type Decorator = (pym: pym.Parent) => CleanupCallback | void;
