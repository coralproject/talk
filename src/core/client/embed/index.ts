import polyfillNodeListForEach from "coral-framework/helpers/polyfillNodeListForEach";

// Include minimal polyfills for IE11
import "core-js/stable/object/assign";
import "intersection-observer"; // also for Safari.

polyfillNodeListForEach();

export * from "./Coral";
