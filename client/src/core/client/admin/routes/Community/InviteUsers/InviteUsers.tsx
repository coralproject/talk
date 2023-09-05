import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { Button, Modal } from "coral-ui/components/v2";

import InviteUsersModal from "./InviteUsersModal";

import styles from "./InviteUsers.css";

const InviteUsers: FunctionComponent = () => {
  const [open, setOpen] = useState(false);

  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  return (
    <div data-testid="invite-users">
      <Localized id="community-invite-invite">
        <Button
          className={styles.button}
          variant="flat"
          color="dark"
          type="button"
          data-testid="invite-users-button"
          onClick={show}
        >
          Invite
        </Button>
      </Localized>
      <Modal open={open}>
        {({ firstFocusableRef, lastFocusableRef }) => (
          <InviteUsersModal
            onHide={hide}
            firstFocusableRef={firstFocusableRef}
            lastFocusableRef={lastFocusableRef}
          />
        )}
      </Modal>
    </div>
  );
};

export default InviteUsers;
