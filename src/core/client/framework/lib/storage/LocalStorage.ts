import prefixStorage from "./prefixStorage";

export default function createLocalStorage(prefix = "coral:"): Storage {
  return prefixStorage(window.localStorage, prefix);
}
