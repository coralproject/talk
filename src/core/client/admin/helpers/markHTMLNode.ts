// markPhrasesHTML looks for `suspect` and `banned` words inside `text` given
// the settings applied for the locale and highlights them by returning an HTML

import { GQLWordlistMatch } from "coral-framework/schema";

interface SplitValue {
  value: string;
  shouldReplace: boolean;
}

function getWordSplit(text: string, matches: GQLWordlistMatch[]) {
  const sortedMatches = matches.map((m) => m).sort((a, b) => a.index - b.index);

  const split: SplitValue[] = [];
  const remainder = text;
  let rollingIndex = 0;
  for (const match of sortedMatches) {
    const before = remainder.substring(
      rollingIndex,
      match.index - rollingIndex
    );
    const after = remainder.substring(
      match.index - rollingIndex + match.length,
      remainder.length
    );

    split.push({ value: before, shouldReplace: false });
    split.push({ value: match.value, shouldReplace: true });
    split.push({ value: after, shouldReplace: false });

    rollingIndex += before.length + match.length;
  }

  return split;
}

// string.
function markPhrasesHTML(text: string, words: GQLWordlistMatch[]) {
  const wordSplit = getWordSplit(text, words);

  let result = "";
  for (const split of wordSplit) {
    if (split.shouldReplace) {
      result += `<mark>${split.value}</mark>`;
    } else {
      result += split.value;
    }
  }

  return result;
}

// markHTMLNode manipulates the node by looking for #text nodes and adding
// markers.
export default function markHTMLNode(
  parentNode: Node,
  words: GQLWordlistMatch[]
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
