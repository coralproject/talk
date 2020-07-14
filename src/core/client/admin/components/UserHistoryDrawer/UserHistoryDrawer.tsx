import React, { FunctionComponent } from "react";

import { Card, Modal } from "coral-ui/components/v2";

import UserHistoryDrawerQuery from "./UserHistoryDrawerQuery";

import styles from "./UserHistoryDrawer.css";

interface UserHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  userID?: string;
}

const UserHistoryDrawer: FunctionComponent<UserHistoryDrawerProps> = ({
  open,
  onClose,
  userID,
}) => {
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

export default UserHistoryDrawer;
