import prefixStorage from "./prefixStorage";

export default function createLocalStorage(): Storage {
  return prefixStorage(window.localStorage, "talk");
}
