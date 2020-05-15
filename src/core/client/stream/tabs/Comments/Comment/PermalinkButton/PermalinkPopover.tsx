import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { useViewerEvent } from "coral-framework/lib/events";
import CLASSES from "coral-stream/classes";
import { CopyPermalinkEvent, ShowSharePopoverEvent } from "coral-stream/events";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./PermalinkPopover.css";

interface Props {
  permalinkURL: string;
  commentID: string;
  toggleVisibility: () => void;
}

const PermalinkPopover: FunctionComponent<Props> = ({
  permalinkURL,
  commentID,
  toggleVisibility,
}) => {
  const emitShowEvent = useViewerEvent(ShowSharePopoverEvent);
  const emitCopyEvent = useViewerEvent(CopyPermalinkEvent);

  // Run once.
  useEffect(() => {
    emitShowEvent({ commentID });
  }, []);

  let timeout: any = null;
  const [copied, setCopied] = useState(false);

  // clear time out when we de-scope
  useEffect(() => {
    return function cleanup() {
      clearTimeout(timeout);
    };
  }, [timeout]);

  const timeoutCallback = useCallback(() => {
    setCopied(false);
    toggleVisibility();
  }, [setCopied, toggleVisibility]);

  const handleCopy = useCallback(() => {
    setCopied(true);
    clearTimeout(timeout);
    timeout = setTimeout(timeoutCallback, 750);

    emitCopyEvent({ commentID });
  }, [timeout, setCopied, emitCopyEvent, commentID]);

  return (
    <Flex
      itemGutter="half"
      className={cn(styles.root, CLASSES.sharePopover.$root)}
    >
      <CopyToClipboard text={permalinkURL} onCopy={handleCopy}>
        <Button
          className={cn(
            styles.buttonRoot,
            copied ? styles.copied : styles.copy
          )}
          color="none"
          variant="none"
          fontSize="none"
          paddingSize="none"
        >
          {copied ? (
            <Flex alignItems="center">
              <Icon size="sm" className={styles.icon}>
                check_circle_outline
              </Icon>
              <Localized id="comments-permalink-copyLink">
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
    </Flex>
  );
};

export default PermalinkPopover;
