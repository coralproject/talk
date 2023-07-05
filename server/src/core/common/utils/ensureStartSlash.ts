const START_SLASH_REGEX = /^\//;

export default function ensureStartSlash(p: string) {
  return START_SLASH_REGEX.exec(p) ? p : `/${p}`;
}
