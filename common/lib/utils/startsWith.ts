/** A substitute for string.startsWith */
export default function startsWith(str: string, search: string, pos?: number) {
  return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
}
