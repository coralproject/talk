import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { Box, Card, CardCloseButton, Typography } from "coral-ui/components";

import InviteForm from "./InviteUsersForm";
import Success from "./Success";

import * as styles from "./InviteUsersModal.css";

interface Props {
  onHide: () => void;
  firstFocusableRef: React.Ref<HTMLButtonElement>;
  lastFocusableRef: React.Ref<HTMLButtonElement>;
}

const InviteUsersModal: FunctionComponent<Props> = ({
  onHide,
  firstFocusableRef,
  lastFocusableRef,
}) => {
  const [finished, setFinished] = useState(false);
  const finish = useCallback(() => setFinished(true), []);

  return (
    <Card className={styles.root} data-testid="invite-users-modal">
      {!finished ? (
        <div>
          <Box className={styles.clearfix} marginBottom={3}>
            <CardCloseButton onClick={onHide} ref={firstFocusableRef} />
            <Localized id="community-invite-inviteMember">
              <Typography variant="header2">
                Invite members to your organization
              </Typography>
            </Localized>
          </Box>
          <InviteForm onFinish={finish} lastRef={lastFocusableRef} />
        </div>
      ) : (
        <Success onClose={onHide} lastFocusableRef={lastFocusableRef} />
      )}
    </Card>
  );
};

export default InviteUsersModal;
