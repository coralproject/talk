import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import {
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
} from "coral-ui/components/v2";

import InviteForm from "./InviteUsersForm";
import Success from "./Success";

import styles from "./InviteUsersModal.css";

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
          <Flex justifyContent="flex-end">
            <CardCloseButton onClick={onHide} ref={firstFocusableRef} />
          </Flex>
          <HorizontalGutter spacing={3}>
            <Localized id="community-invite-inviteMember">
              <h2 className={styles.title}>
                Invite members to your organization
              </h2>
            </Localized>
            <InviteForm onFinish={finish} lastRef={lastFocusableRef} />
          </HorizontalGutter>
        </div>
      ) : (
        <Success onClose={onHide} lastFocusableRef={lastFocusableRef} />
      )}
    </Card>
  );
};

export default InviteUsersModal;
