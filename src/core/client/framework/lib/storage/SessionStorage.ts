import prefixStorage from "./prefixStorage";

export default function createSessionStorage(): Storage {
  return prefixStorage(window.sessionStorage, "talk");
}
