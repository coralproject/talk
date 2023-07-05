const prefix = "comment-";
export default function parseCommentElementID(elementID: string): string {
  return elementID.substr(prefix.length);
}
