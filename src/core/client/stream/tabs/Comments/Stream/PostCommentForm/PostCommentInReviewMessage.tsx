import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Button, Flex, Message } from "coral-ui/components";

import styles from "./PostCommentInReviewMessage.css";

export interface PostCommentInReviewProps {
  onDismiss: () => void;
}

const PostCommentInReview: FunctionComponent<PostCommentInReviewProps> = (
  props
) => {
  return (
    <Message
      color="primary"
      className={CLASSES.createComment.inReview}
      fullWidth
    >
      <Flex justifyContent="space-between" className={styles.flex}>
        <Localized id="comments-submitStatus-submittedAndWillBeReviewed">
          <div>
            Your comment has been submitted and will be reviewed by a moderator
          </div>
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

export default PostCommentInReview;
