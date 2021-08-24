import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { useViewerEvent } from "coral-framework/lib/events";
import CLASSES from "coral-stream/classes";
import { CopyPermalinkEvent } from "coral-stream/events";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./PermalinkCopyButton.css";

interface Props {
  permalinkURL: string;
  commentID: string;
  onCopied: () => void;
  variant?: "regular" | "outlined";
  paddingSize?: "extraSmall" | "small" | "medium" | "large" | "none";
  upperCase?: boolean;
}

const PermalinkCopyButton: FunctionComponent<Props> = ({
  permalinkURL,
  commentID,
  onCopied,
  variant = "regular",
  paddingSize = "small",
  upperCase = false,
}) => {
  const emitCopyEvent = useViewerEvent(CopyPermalinkEvent);

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    setCopied(true);
    emitCopyEvent({ commentID });

    onCopied();
  }, [setCopied, emitCopyEvent, commentID, onCopied]);

  return (
    <CopyToClipboard text={permalinkURL} onCopy={handleCopy}>
      <Button
        className={cn(
          CLASSES.sharePopover.copyButton,
          styles.buttonRoot,
          copied ? styles.copied : styles.copy,
          {
            [styles.outlined]: variant === "outlined",
          }
        )}
        color="none"
        variant="none"
        fontSize="small"
        fontWeight={copied ? "semiBold" : "regular"}
        paddingSize={paddingSize}
        upperCase={upperCase}
      >
        {copied ? (
          <Flex alignItems="center">
            <Icon size="sm" className={styles.icon}>
              check_circle_outline
            </Icon>
            <Localized id="comments-permalink-linkCopied">
              <span>Link copied</span>
            </Localized>
          </Flex>
        ) : (
          <Flex alignItems="center">
            <Icon size="sm" className={styles.icon}>
              link
            </Icon>
            <Localized id="comments-permalink-copyLink">
              <span>Copy link</span>
            </Localized>
          </Flex>
        )}
      </Button>
    </CopyToClipboard>
  );
};

export default PermalinkCopyButton;
