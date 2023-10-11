import React, { FunctionComponent } from "react";

import { Card, Modal } from "coral-ui/components/v2";

import styles from "./ModerationReason.css";

export interface Props {
  open: boolean;
  commentID: string;
}

const ModerationReason: FunctionComponent<Props> = ({ open, commentID }) => {
  /* eslint-disable */
  console.log("Moderation reason", { open });
  return (
    <Modal open={open}>
      <Card className={styles.root} data-testid="moderation-reason-modal" data-commentid={commentID}>
        <h2>Moderation Reason Modal!</h2>
      </Card>
    </Modal>
  );
};

export default ModerationReason;
