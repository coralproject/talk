import cn from "classnames";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { useViewerEvent } from "coral-framework/lib/events";
import CLASSES from "coral-stream/classes";
import { ShowSharePopoverEvent } from "coral-stream/events";
import { Flex } from "coral-ui/components/v2";

import PermalinkCopyButton from "./PermalinkCopyButton";

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

  // Run once.
  useEffect(() => {
    emitShowEvent({ commentID });
  }, [emitShowEvent, commentID]);

  const timeout: any = useRef<any>(null);

  // clear time out when we de-scope
  useEffect(() => {
    return function cleanup() {
      clearTimeout(timeout);
    };
  }, [timeout]);

  const timeoutCallback = useCallback(() => {
    toggleVisibility();
  }, [toggleVisibility]);

  const onCopied = useCallback(() => {
    clearTimeout(timeout);
    timeout.current = setTimeout(timeoutCallback, 750);
  }, [timeout, timeoutCallback]);

  return (
    <Flex
      itemGutter="half"
      className={cn(styles.root, CLASSES.sharePopover.$root)}
    >
      <PermalinkCopyButton
        onCopied={onCopied}
        permalinkURL={permalinkURL}
        commentID={commentID}
        className={CLASSES.sharePopover.copyButton}
      />
    </Flex>
  );
};

export default PermalinkPopover;
