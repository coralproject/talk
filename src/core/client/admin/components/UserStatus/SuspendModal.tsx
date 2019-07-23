import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useState } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import {
  Button,
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
  Modal,
  RadioButton,
  Typography,
} from "coral-ui/components";

import styles from "./SuspendModal.css";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (timeout: number) => void;
}

const SuspendModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
}) => {
  const [duration, setDuration] = useState("3600");
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="suspendModal-title">
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.card}>
          <CardCloseButton onClick={onClose} ref={firstFocusableRef} />
          <HorizontalGutter size="double">
            <HorizontalGutter>
              <Localized
                id="community-suspendModal-areYouSure"
                strong={<strong />}
                $username={username || <NotAvailable />}
              >
                <Typography variant="header2" id="suspendModal-title">
                  Suspend <strong>{username || <NotAvailable />}</strong>?
                </Typography>
              </Localized>
            </HorizontalGutter>
            <Typography>
              While suspended, this user will no longer be able to comment, use
              reactions, or report comments.
            </Typography>
            <RadioButton
              value={duration}
              checked={duration === "3600"}
              onChange={e => (e.target.checked ? setDuration("3600") : null)}
            >
              <span>1 hour</span>
            </RadioButton>
            <RadioButton
              value={duration}
              checked={duration === "10800"}
              onChange={e => (e.target.checked ? setDuration("10800") : null)}
            >
              <span>3 hours</span>
            </RadioButton>
            <RadioButton
              value={duration}
              checked={duration === "86400"}
              onChange={e => (e.target.checked ? setDuration("86400") : null)}
            >
              <span>24 hours</span>
            </RadioButton>
            <RadioButton
              value={duration}
              checked={duration === "604800"}
              onChange={e => (e.target.checked ? setDuration("604800") : null)}
            >
              <span>7 days</span>
            </RadioButton>
            <Flex justifyContent="flex-end" itemGutter="half">
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Localized id="community-suspendModal-suspendUser">
                <Button
                  variant="filled"
                  color="primary"
                  onClick={() => onConfirm(parseInt(duration, 10))}
                  ref={lastFocusableRef}
                >
                  Suspend User
                </Button>
              </Localized>
            </Flex>
          </HorizontalGutter>
        </Card>
      )}
    </Modal>
  );
};

export default SuspendModal;
