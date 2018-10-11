export default function ensureEndSlash(p: string) {
  return p.replace(/\/$/, "");
}
