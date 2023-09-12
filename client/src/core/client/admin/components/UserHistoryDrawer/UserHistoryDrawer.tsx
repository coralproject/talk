import React, { FunctionComponent } from "react";

import { Card, Modal } from "coral-ui/components/v2";

import UserHistoryDrawerQuery from "./UserHistoryDrawerQuery";

import styles from "./UserHistoryDrawer.css";

interface UserHistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  userID?: string;
  setUserID?: (id: string) => void;
}

const UserHistoryDrawer: FunctionComponent<UserHistoryDrawerProps> = ({
  open,
  onClose,
  userID,
  setUserID,
}) => {
  return (
    <Modal open={open} onClose={onClose} data-testid="userHistoryDrawer-modal">
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.root}>
          {userID && (
            <UserHistoryDrawerQuery
              userID={userID}
              onClose={onClose}
              firstFocusableRef={firstFocusableRef}
              lastFocusableRef={lastFocusableRef}
              setUserID={setUserID}
            />
          )}
        </Card>
      )}
    </Modal>
  );
};

export default UserHistoryDrawer;
