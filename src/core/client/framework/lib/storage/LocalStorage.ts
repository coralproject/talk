import prefixStorage from "./prefixStorage";

export default function createLocalStorage(prefix = "talk"): Storage {
  return prefixStorage(window.localStorage, prefix);
}
