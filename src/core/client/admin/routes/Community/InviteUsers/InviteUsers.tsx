import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import {
  Button,
  Card,
  CardCloseButton,
  HorizontalGutter,
  Modal,
  Typography,
} from "coral-ui/components";

import InviteForm from "./InviteUsersForm";

import * as styles from "./InviteUsers.css";

const InviteUsers: FunctionComponent<{}> = () => {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  return (
    <div>
      <Button variant="filled" color="primary" type="button" onClick={show}>
        Invite
      </Button>
      <Modal open={open}>
        {({ firstFocusableRef, lastFocusableRef }) => (
          <Card className={styles.root}>
            <HorizontalGutter spacing={3}>
              <div>
                <CardCloseButton onClick={hide} ref={firstFocusableRef} />
                <Localized id="community-invite-inviteMember">
                  <Typography variant="header2">
                    Invite members to your organization
                  </Typography>
                </Localized>
              </div>
              <InviteForm onClose={hide} lastRef={lastFocusableRef} />
            </HorizontalGutter>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default InviteUsers;
