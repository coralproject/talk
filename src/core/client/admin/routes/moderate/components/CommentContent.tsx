import cn from "classnames";
import { memoize } from "lodash";
import React, { StatelessComponent } from "react";

import { createPurify } from "talk-common/utils/purify";
import { Typography } from "talk-ui/components";

import styles from "./CommentContent.css";

/**
 * Create a purify instance that will be used to handle HTML content.
 */
const purify = createPurify(window, false);

interface Props {
  className?: string;
  children: string;
  suspectWords: ReadonlyArray<string>;
  bannedWords: ReadonlyArray<string>;
}

function escapeHTML(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

// generate a regulare expression that catches the `phrases`.
function generateRegExp(phrases: ReadonlyArray<string>) {
  const inner = phrases
    .map(phrase =>
      phrase
        .split(/\s+/)
        .map(word => escapeRegExp(word))
        .join('[\\s"?!.]+')
    )
    .join("|");

  const pattern = `(^|[^\\w])(${inner})(?=[^\\w]|$)`;
  try {
    return new RegExp(pattern, "iu");
  } catch (_err) {
    // IE does not support unicode support, so we'll create one without.
    return new RegExp(pattern, "i");
  }
}

// Generate a regular expression detecting `suspectWords` and `bannedWords` phrases.
function getPhrasesRegexp(
  suspectWords: ReadonlyArray<string>,
  bannedWords: ReadonlyArray<string>
) {
  return generateRegExp([...suspectWords, ...bannedWords]);
}

// Memoized version as arguments rarely change.
const getPhrasesRegexpMemoized = memoize(getPhrasesRegexp);

// markPhrasesHTML looks for `supsectWords` and `bannedWords` inside `text` and highlights them by returning
// a HTML string.
function markPhrasesHTML(
  text: string,
  suspectWords: ReadonlyArray<string>,
  bannedWords: ReadonlyArray<string>
) {
  const regexp = getPhrasesRegexpMemoized(suspectWords, bannedWords);
  const tokens = text.split(regexp);
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
function markHTMLNode(
  parentNode: Node,
  suspectWords: ReadonlyArray<string>,
  bannedWords: ReadonlyArray<string>
) {
  parentNode.childNodes.forEach(node => {
    if (node.nodeName === "#text") {
      const newContent = markPhrasesHTML(
        node.textContent!,
        suspectWords,
        bannedWords
      );
      if (newContent !== node.textContent) {
        const newNode = document.createElement("span");
        newNode.innerHTML = newContent;
        parentNode.replaceChild(newNode, node);
      }
    } else {
      markHTMLNode(node, suspectWords, bannedWords);
    }
  });
}

const CommentContent: StatelessComponent<Props> = ({
  suspectWords,
  bannedWords,
  className,
  children,
}) => {
  // We create a Shadow DOM Tree with the HTML body content and
  // use it as a parser.
  const node = document.createElement("div");
  node.innerHTML = purify.sanitize(children);

  if (suspectWords.length || bannedWords.length) {
    // Then we traverse it recursively and manipulate it to highlight suspect words
    // and banned words.
    markHTMLNode(node, suspectWords, bannedWords);
  }

  // Finally we render the content of the Shadow DOM Tree
  return (
    <Typography
      className={cn(className, styles.root)}
      dangerouslySetInnerHTML={{ __html: node.innerHTML }}
      container="div"
    />
  );
};

export default CommentContent;
