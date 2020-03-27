import cn from "classnames";
import React, { FunctionComponent, useMemo } from "react";

import { getPhrasesRegExp, GetPhrasesRegExpOptions } from "coral-admin/helpers";
import { createPurify } from "coral-common/utils/purify";

import styles from "./CommentContent.css";

/**
 * Create a purify instance that will be used to handle HTML content.
 */
const purify = createPurify(window, false);

interface Props {
  className?: string;
  children: string | React.ReactElement;
  phrases: GetPhrasesRegExpOptions;
}

function escapeHTML(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// markPhrasesHTML looks for `supsect` and `banned` words inside `text` given
// the settings applied for the locale and highlights them by returning an HTML
// string.
function markPhrasesHTML(text: string, expression: RegExp) {
  const tokens = text.split(expression);
  if (tokens.length === 1) {
    return text;
  }
  return tokens
    .map((token, i) =>
      // Using our Regexp patterns it returns tokens arranged this way
      // [STRING_WITH_NO_MATCH, NEW_WORD_DELIMITER, MATCHED_WORD, ...].
      // This pattern repeats throughout. Next line will mark MATCHED_WORD
      // and escape all tokens.
      i % 3 === 2 ? `<mark>${escapeHTML(token)}</mark>` : escapeHTML(token)
    )
    .join("");
}

// markHTMLNode manipulates the node by looking for #text nodes and adding markers
// for `supsectWords` and `bannedWords`.
function markHTMLNode(parentNode: Node, expression: RegExp) {
  parentNode.childNodes.forEach(node => {
    if (node.nodeName === "#text") {
      const newContent = markPhrasesHTML(node.textContent!, expression);
      if (newContent !== node.textContent) {
        const newNode = document.createElement("span");
        newNode.innerHTML = newContent;
        parentNode.replaceChild(newNode, node);
      }
    } else {
      markHTMLNode(node, expression);
    }
  });
}

const CommentContent: FunctionComponent<Props> = ({
  phrases,
  className,
  children,
}) => {
  // Cache the expression used via memo. This will reduce duplicate renders of
  // this comment content when the children change but the phrase configuration
  // does not change. The regExp is already cached on a deeper level
  // automatically, this is just lessening that impact further.
  const expression = useMemo(() => getPhrasesRegExp(phrases), [phrases]);

  if (typeof children === "string") {
    // We create a Shadow DOM Tree with the HTML body content and
    // use it as a parser.
    const node = document.createElement("div");
    node.innerHTML = purify.sanitize(children);

    if (expression) {
      // Then we traverse it recursively and manipulate it to highlight suspect words
      // and banned words.
      markHTMLNode(node, expression);
    }

    // Finally we render the content of the Shadow DOM Tree
    return (
      <div
        className={cn(className, styles.root)}
        dangerouslySetInnerHTML={{ __html: node.innerHTML }}
      />
    );
  }

  return <>{children}</>;
};

export default CommentContent;
