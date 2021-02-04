import prefixStorage from "./prefixStorage";

export default function createSessionStorage(
  window: Window,
  prefix = "coral:"
): Storage {
  return prefixStorage(window.sessionStorage, prefix);
}
