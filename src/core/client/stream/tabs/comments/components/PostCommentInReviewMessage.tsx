import React, { FunctionComponent } from "react";

import { Button, Flex, Message } from "talk-ui/components";

import { Localized } from "fluent-react/compat";
import styles from "./PostCommentInReviewMessage.css";

export interface PostCommentInReviewProps {
  onDismiss: () => void;
}

const PostCommentInReview: FunctionComponent<
  PostCommentInReviewProps
> = props => {
  return (
    <Message color="primary" fullWidth>
      <Flex justifyContent="space-between" className={styles.flex}>
        <Localized id="comments-submitStatus-submittedAndWillBeReviewed">
          <div>
            Your comment has been submitted and will be reviewed by a moderator
          </div>
        </Localized>
        <Localized id="comments-submitStatus-dismiss">
          <Button onClick={props.onDismiss} variant="underlined" color="light">
            Dismiss
          </Button>
        </Localized>
      </Flex>
    </Message>
  );
};

export default PostCommentInReview;
