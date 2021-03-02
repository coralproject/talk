// markPhrasesHTML looks for `suspect` and `banned` words inside `text` given
// the settings applied for the locale and highlights them by returning an HTML
// string.
function markPhrasesHTML(text: string, expression: RegExp) {
  const tokens = text.split(expression);

  // If there were less than two matches, then there was no matched word
  // associated with the passed in text.
  if (tokens.length < 3) {
    return null;
  }

  return tokens
    .map((token, i) =>
      // Using our Regexp patterns it returns tokens arranged this way:
      //
      //  - STRING_WITH_NO_MATCH
      //  - NEW_WORD_DELIMITER
      //  - MATCHED_WORD
      //  - NEW_WORD_DELIMITER
      //  - ...
      //
      // This pattern repeats throughout. Next line will mark MATCHED_WORD.
      i % 4 === 2 ? "<mark>" + token + "</mark>" : token
    )
    .join("");
}

// markHTMLNode manipulates the node by looking for #text nodes and adding
// markers.
export default function markHTMLNode(parentNode: Node, expression: RegExp) {
  parentNode.childNodes.forEach((node) => {
    // Anchor links are already marked by default, skip them now.
    if (node.nodeName === "A") {
      return;
    }

    // If the node isn't of text type then we can't mark it directly.
    if (node.nodeName !== "#text") {
      return markHTMLNode(node, expression);
    }

    // If the node doesn't have any text content, then we can't mark it either.
    if (!node.textContent) {
      return;
    }

    // We've encountered a text node with text content that isn't in an anchor
    // link. We should try to mark and replace it's content.
    const replacement = markPhrasesHTML(node.textContent, expression);
    if (replacement) {
      // Create the new span node to replace the old node with.
      const newNode = parentNode.ownerDocument!.createElement("span");
      newNode.innerHTML = replacement;
      parentNode.replaceChild(newNode, node);
    }
  });
}
