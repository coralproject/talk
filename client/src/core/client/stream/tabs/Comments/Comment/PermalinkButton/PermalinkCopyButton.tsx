import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useViewerEvent } from "coral-framework/lib/events";
import { CopyPermalinkEvent } from "coral-stream/events";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./PermalinkCopyButton.css";

const TIMEOUT = 800;

interface Props {
  className?: string;
  permalinkURL: string;
  commentID: string;
  onCopied?: () => void;
  variant?: "regular" | "outlined";
  paddingSize?: "extraSmall" | "small" | "medium" | "large" | "none";
  upperCase?: boolean;
}

const PermalinkCopyButton: FunctionComponent<Props> = ({
  className,
  permalinkURL,
  commentID,
  onCopied,
  variant = "regular",
  paddingSize = "small",
  upperCase = false,
}) => {
  const { window } = useCoralContext();

  const emitCopyEvent = useViewerEvent(CopyPermalinkEvent);

  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const onTimeout = useCallback(() => {
    timeoutRef.current = null;
    setCopied(false);
  }, [setCopied]);

  const handleCopy = useCallback(() => {
    setCopied(true);
    emitCopyEvent({ commentID });

    if (onCopied) {
      onCopied();
    }
    timeoutRef.current = window.setTimeout(onTimeout, TIMEOUT);
  }, [emitCopyEvent, commentID, onCopied, window, onTimeout]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <CopyToClipboard text={permalinkURL} onCopy={handleCopy}>
      <Button
        className={cn(
          className,
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
