const END_SLASH_REGEX = /\/$/;

export default function ensureEndSlash(p: string) {
  return END_SLASH_REGEX.exec(p) ? p : `${p}/`;
}
