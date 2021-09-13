import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useMemo } from "react";

import {
  getPhrasesRegExp,
  GetPhrasesRegExpOptions,
  markHTMLNode,
} from "coral-admin/helpers";
import {
  ALL_FEATURES,
  createSanitize,
  Sanitize,
} from "coral-common/helpers/sanitize";
import { Tag } from "coral-ui/components/v2";

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
            FORBID_TAGS: highlight
              ? ["b", "strong", "i", "em", "s", "span"]
              : [],
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
  phrases?: GetPhrasesRegExpOptions;
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
    if (!highlight || !phrases) {
      return null;
    }

    return getPhrasesRegExp(phrases);
  }, [phrases, highlight]);

  const sanitizedNode = useMemo(() => {
    if (typeof children !== "string") {
      return null;
    }

    // Sanitize the input for display.
    return getSanitize(highlight && !!phrases)(children);
  }, [children, highlight, phrases]);

  // Cache the parsed comment node. If the children cannot be parsed, this will
  // be null.
  const { exceededLength, parsed } = useMemo(() => {
    if (!sanitizedNode) {
      return { exceededLength: false, parsed: null };
    }

    let tooLong = false;
    // If the expression is available, then mark the nodes.
    if (expression) {
      const result = markHTMLNode(sanitizedNode, expression);
      tooLong = result.exceededLength;
    }

    return { exceededLength: tooLong, parsed: sanitizedNode };
  }, [expression, sanitizedNode]);

  if (parsed) {
    return (
      <>
        <div
          className={cn(className, styles.root, highlight && styles.highlight)}
          dangerouslySetInnerHTML={{ __html: parsed.innerHTML }}
        />
        {exceededLength && (
          <div className={styles.lengthWarning}>
            <Localized id="moderate-highlightLengthWarning">
              <Tag className={styles.warningTag} color="error">
                Highlighting has been disabled for this comment due to its
                length
              </Tag>
            </Localized>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
};

export default CommentContent;
