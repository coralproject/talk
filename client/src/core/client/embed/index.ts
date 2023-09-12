import * as Coral from "./Coral";
export * from "./Coral";

declare global {
  interface Window {
    Coral: typeof Coral;
  }
}
