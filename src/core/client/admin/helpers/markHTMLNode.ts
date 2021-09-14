// markPhrasesHTML looks for `suspect` and `banned` words inside `text` given
// the settings applied for the locale and highlights them by returning an HTML
// string.
function markPhrasesHTML(text: string, words: Readonly<string[]>) {
  for (const word of words) {
    const split = text.split(word);
    text = split.join(`<mark>${word}</mark>`);
  }

  return text;
}

// markHTMLNode manipulates the node by looking for #text nodes and adding
// markers.
export default function markHTMLNode(
  parentNode: Node,
  words: Readonly<string[]>
) {
  parentNode.childNodes.forEach((node) => {
    // Anchor links are already marked by default, skip them now.
    if (node.nodeName === "A") {
      return;
    }

    // If the node isn't of text type then we can't mark it directly.
    if (node.nodeName !== "#text") {
      return markHTMLNode(node, words);
    }

    // If the node doesn't have any text content, then we can't mark it either.
    if (!node.textContent) {
      return;
    }

    // We've encountered a text node with text content that isn't in an anchor
    // link. We should try to mark and replace it's content.
    const replacement = markPhrasesHTML(node.textContent, words);
    if (replacement) {
      // Create the new span node to replace the old node with.
      const newNode = parentNode.ownerDocument!.createElement("span");
      newNode.innerHTML = replacement;
      parentNode.replaceChild(newNode, node);
    }
  });
}
