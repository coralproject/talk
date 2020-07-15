import React, { FunctionComponent } from "react";

import { Modal } from "coral-ui/components/v2";

import ConversationModalQuery from "./ConversationModalQuery";

interface ConversationModalProps {
  open: boolean;
  onClose: () => void;
  commentID?: string;
  onUsernameClicked: (userID: string) => void;
}

const ConversationModal: FunctionComponent<ConversationModalProps> = ({
  open,
  onClose,
  commentID,
  onUsernameClicked,
}) => {
  if (!commentID) {
    return null;
  }
  return (
    <Modal open={open} onClose={onClose}>
      {({ firstFocusableRef, lastFocusableRef }) => (
        <ConversationModalQuery
          commentID={commentID}
          onClose={onClose}
          firstFocusableRef={firstFocusableRef}
          lastFocusableRef={lastFocusableRef}
          onUsernameClicked={onUsernameClicked}
        />
      )}
    </Modal>
  );
};

export default ConversationModal;
