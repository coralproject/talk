import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button, Flex, Message } from "coral-ui/components";

import styles from "./PostCommentRejectedMessage.css";

export interface PostCommentRejectedProps {
  onDismiss: () => void;
}

const PostCommentRejected: FunctionComponent<PostCommentRejectedProps> = (
  props
) => {
  return (
    <Message color="error" className={CLASSES.createComment.rejected} fullWidth>
      <Flex justifyContent="space-between" className={styles.flex}>
        <Localized id="comments-submitStatus-submittedAndRejected">
          <div>This comment has been rejected for violating our guidelines</div>
        </Localized>
        <div className={styles.buttonWrapper}>
          <Localized id="comments-submitStatus-dismiss">
            <Button
              className={CLASSES.createComment.dismissButton}
              onClick={props.onDismiss}
              variant="underlined"
              color="light"
            >
              Dismiss
            </Button>
          </Localized>
        </div>
      </Flex>
    </Message>
  );
};

export default PostCommentRejected;
