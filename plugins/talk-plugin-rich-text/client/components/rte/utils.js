export function hasAncestor(tag) {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  let cur = range.startContainer;
  do {
    if (cur.nodeName === tag) {
      return true;
    }
    cur = cur.parentNode;
  } while (cur);
  return false;
}
