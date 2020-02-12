import React, { FunctionComponent } from "react";

import { Modal } from "coral-ui/components";
import { Card } from "coral-ui/components/v2";

import ConversationModalQuery from "./ConversationModalQuery";

// import styles from "./ConversationModal.css";

interface ConversationModalProps {
  open: boolean;
  onClose: () => void;
  commentID?: string;
}

const ConversationModal: FunctionComponent<ConversationModalProps> = ({
  open,
  onClose,
  commentID,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card>
          {commentID && (
            <ConversationModalQuery
              commentID={commentID}
              onClose={onClose}
              firstFocusableRef={firstFocusableRef}
              lastFocusableRef={lastFocusableRef}
            />
          )}
        </Card>
      )}
    </Modal>
  );
};

export default ConversationModal;
