export default function ensureEndSlash(p: string) {
  return p.match(/\/$/) ? p : `${p}/`;
}
