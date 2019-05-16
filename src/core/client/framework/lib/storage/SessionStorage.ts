import prefixStorage from "./prefixStorage";

export default function createSessionStorage(prefix = "coral:"): Storage {
  return prefixStorage(window.sessionStorage, prefix);
}
