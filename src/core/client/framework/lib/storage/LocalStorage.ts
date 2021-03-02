import prefixStorage from "./prefixStorage";

export default function createLocalStorage(
  window: Window,
  prefix = "coral:"
): Storage {
  return prefixStorage(window.localStorage, prefix);
}
