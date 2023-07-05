export default function ensureNoEndSlash(p: string) {
  return p.replace(/\/$/, "");
}
