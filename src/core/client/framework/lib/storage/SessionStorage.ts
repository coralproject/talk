import prefixStorage from "./prefixStorage";

export default function createSessionStorage(prefix = "talk:"): Storage {
  return prefixStorage(window.sessionStorage, prefix);
}
