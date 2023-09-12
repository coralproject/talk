export default function ensureNoStartSlash(p: string) {
  return p.replace(/^\//, "");
}
