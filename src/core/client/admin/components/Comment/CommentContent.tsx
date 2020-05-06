import cn from "classnames";
import { DOMPurifyI } from "dompurify";
import React, { FunctionComponent, useMemo } from "react";

import {
  getPhrasesRegExp,
  GetPhrasesRegExpOptions,
  markHTMLNode,
} from "coral-admin/helpers";
import createPurify, { purifyConfig } from "coral-common/helpers/createPurify";

import styles from "./CommentContent.css";

/** Resused DOMPurify instance */
let purify: DOMPurifyI | null = null;

/**
 * Return a purify instance that will be used to handle HTML content.
 */
function getPurifyInstance(highlight: boolean) {
  if (!purify) {
    purify = createPurify(window, {
      normalize: true,
    });
  }
  purify.setConfig({
    ...purifyConfig,
    FORBID_TAGS: highlight ? ["b", "strong", "i", "em", "s", "span"] : [],
    RETURN_DOM: true,
  });
  return purify;
}

interface Props {
  className?: string;
  children: string | React.ReactElement;
  phrases: GetPhrasesRegExpOptions;
  highlight?: boolean;
}

const CommentContent: FunctionComponent<Props> = ({
  phrases,
  className,
  children,
  highlight = false,
}) => {
  // Cache the expression used via memo. This will reduce duplicate renders of
  // this comment content when the children change but the phrase configuration
  // does not change. The regExp is already cached on a deeper level
  // automatically, this is just lessening that impact further.
  const expression = useMemo(() => {
    // If we aren't in highlight mode for this comment, don't even attempt to
    // generate the expression.
    if (!highlight) {
      return null;
    }

    return getPhrasesRegExp(phrases);
  }, [phrases, highlight]);

  // Cache the parsed comment node. If the children cannot be parsed, this will
  // be null.
  const parsed = useMemo(() => {
    if (typeof children !== "string") {
      return null;
    }

    // Sanitize the input for display.
    const node = getPurifyInstance(highlight).sanitize(children, {
      // TODO: Be aware, this has only affect on the return type. It does not affect the config.
      RETURN_DOM: true,
    });

    // If the expression is available, then mark the nodes.
    if (expression) {
      markHTMLNode(node, expression);
    }

    return node;
  }, [children, expression, highlight]);

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
