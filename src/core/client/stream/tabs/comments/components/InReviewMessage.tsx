import React, { StatelessComponent } from "react";

import { Button, Flex, Message } from "talk-ui/components";

import styles from "./InReviewMessage.css";

export interface InReviewProps {
  onDismiss: () => void;
}

const InReview: StatelessComponent<InReviewProps> = props => {
  return (
    <Message color="primary" fullWidth>
      <Flex justifyContent="space-between" className={styles.flex}>
        <div>
          Your comment has been submitted and will be reviewed by a moderator
        </div>
        <Button onClick={props.onDismiss} variant="underlined" color="light">
          Dismiss
        </Button>
      </Flex>
    </Message>
  );
};

export default InReview;
