import cn from "classnames";
import React, { FunctionComponent, useMemo } from "react";

import markPhrasesHTML from "coral-admin/helpers/markHTMLNode";
import {
  ALL_FEATURES,
  createSanitize,
  Sanitize,
  WORDLIST_FORBID_TAGS,
} from "coral-common/helpers/sanitize";
import { GQLWordlistMatch } from "coral-framework/schema";

import styles from "./CommentContent.css";

/**
 * Return a purify instance that will be used to handle HTML content.
 */
const getSanitize: (highlight: boolean) => Sanitize = (() => {
  let sanitizers: Record<"default" | "highlight", Sanitize> | null = null;
  return (highlight: boolean) => {
    if (!sanitizers) {
      sanitizers = {
        // eslint-disable-next-line no-restricted-globals
        default: createSanitize(window, {
          // Allow all RTE features to be displayed.
          features: ALL_FEATURES,
        }),
        // eslint-disable-next-line no-restricted-globals
        highlight: createSanitize(window, {
          // We need normalized text nodes to mark nodes for suspect/banned words.
          normalize: true,
          // Allow all RTE features to be displayed.
          features: ALL_FEATURES,
          config: {
            FORBID_TAGS: highlight ? WORDLIST_FORBID_TAGS : [],
          },
        }),
      };
    }
    if (highlight) {
      return sanitizers.highlight!;
    }
    return sanitizers.default!;
  };
})();

interface Props {
  className?: string;
  children: string | React.ReactElement;
  highlight?: boolean;
  bannedWords?: Readonly<Readonly<GQLWordlistMatch>[]>;
  suspectWords?: Readonly<Readonly<GQLWordlistMatch>[]>;
}

const CommentContent: FunctionComponent<Props> = ({
  className,
  children,
  bannedWords,
  suspectWords,
  highlight = false,
}) => {
  // Cache the parsed comment node. If the children cannot be parsed, this will
  // be null.
  const parsed = useMemo(() => {
    if (typeof children !== "string") {
      return null;
    }

    let words: GQLWordlistMatch[] = [];
    if (bannedWords) {
      words = [...words, ...bannedWords];
    }
    if (suspectWords) {
      words = [...words, ...suspectWords];
    }
    // Sanitize the input for display.
    const node = getSanitize(highlight)(children);

    // Mark word list phrases
    const replacement = markPhrasesHTML(node.innerHTML, words);
    node.innerHTML = replacement;

    return node;
  }, [bannedWords, children, highlight, suspectWords]);

  if (parsed) {
    return (
      <div
        className={cn(className, styles.root, highlight && styles.highlight)}
        dangerouslySetInnerHTML={{ __html: parsed.innerHTML }}
      />
    );
  }

  return <>{children}</>;
};

export default CommentContent;
