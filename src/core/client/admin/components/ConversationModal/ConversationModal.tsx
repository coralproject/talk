import React, { FunctionComponent } from "react";

import { Modal } from "coral-ui/components";

import ConversationModalQuery from "./ConversationModalQuery";

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
        <>
          {commentID && (
            <ConversationModalQuery
              commentID={commentID}
              onClose={onClose}
              firstFocusableRef={firstFocusableRef}
              lastFocusableRef={lastFocusableRef}
            />
          )}
        </>
      )}
    </Modal>
  );
};

export default ConversationModal;
