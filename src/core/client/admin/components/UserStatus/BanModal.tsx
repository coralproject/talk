import {
  Button,
  Card,
  CardCloseButton,
  CheckBox,
  Flex,
  HorizontalGutter,
  Modal,
  Typography,
} from "coral-ui/components";
import { Localized } from "fluent-react/compat";

import NotAvailable from "coral-admin/components/NotAvailable";
import { Format, withFormat } from "coral-framework/lib/i18n";
import React, { FunctionComponent, useState } from "react";

import styles from "./BanModal.css";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (message?: string) => void;
  format: Format;
}

const BanModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
  format,
}) => {
  function getMessage(): string {
    return format("community-banModal-emailTemplate", {
      username,
    });
  }
  const [emailMessage, setEmailMessage] = useState(getMessage());
  const [showMessage, setShowMessage] = useState(false);
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="banModal-title">
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.card}>
          <CardCloseButton onClick={onClose} ref={firstFocusableRef} />
          <HorizontalGutter size="double">
            <HorizontalGutter>
              <Localized
                id="community-banModal-areYouSure"
                strong={<strong />}
                $username={username || <NotAvailable />}
              >
                <Typography variant="header2" id="banModal-title">
                  Are you sure you want to ban{" "}
                  <strong>{username || <NotAvailable />}</strong>?
                </Typography>
              </Localized>
              <Localized id="community-banModal-consequence">
                <Typography>
                  Once banned, this user will no longer be able to comment, use
                  reactions, or report comments.
                </Typography>
              </Localized>
            </HorizontalGutter>
            <Localized id="community-banModal-customize">
              <CheckBox
                id="ban-edit-message"
                name="ban-edit-message"
                checked={showMessage}
                onChange={e => {
                  setShowMessage(e.target.checked);
                }}
              >
                Customize ban email message
              </CheckBox>
            </Localized>

            {showMessage && (
              <textarea
                id="banModal-message"
                value={emailMessage}
                className={styles.textArea}
                onChange={e => {
                  setEmailMessage(e.target.value);
                }}
              />
            )}

            <Flex justifyContent="flex-end" itemGutter="half">
              <Localized id="community-banModal-cancel">
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
              </Localized>
              <Localized id="community-banModal-banUser">
                <Button
                  variant="filled"
                  color="primary"
                  onClick={() => onConfirm(emailMessage)}
                  ref={lastFocusableRef}
                >
                  Ban User
                </Button>
              </Localized>
            </Flex>
          </HorizontalGutter>
        </Card>
      )}
    </Modal>
  );
};

const enhanced = withFormat(BanModal);

export default enhanced;
