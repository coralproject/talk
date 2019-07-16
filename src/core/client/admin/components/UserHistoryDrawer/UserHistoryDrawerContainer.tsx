import React, { FunctionComponent } from "react";

import { Card, Modal } from "coral-ui/components";

import styles from "./UserHistoryDrawerContainer.css";
import UserHistoryDrawerQuery from "./UserHistoryDrawerQuery";

interface UserHistoryDrawerContainerProps {
  open: boolean;
  onClose: () => void;
  userID?: string;
}

const UserHistoryDrawerContainer: FunctionComponent<
  UserHistoryDrawerContainerProps
> = ({ open, onClose, userID }) => {
  return (
    <Modal open={open} onClose={onClose}>
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.root}>
          {userID && (
            <UserHistoryDrawerQuery
              userID={userID}
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

export default UserHistoryDrawerContainer;
