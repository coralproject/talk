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

const DURATIONS: [string, string][] = [
  ["3600", "1 hour"],
  ["10800", "3 hours"],
  ["86400", "24 hours"],
  ["604800", "7 days"],
];

const SuspendModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
}) => {
  const [duration, setDuration] = useState("10800");
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

            {DURATIONS.map(([value, label]) => (
              <RadioButton
                key={value}
                id={`duration-${value}`}
                name="duration"
                value={duration}
                checked={duration === value}
                onChange={e => (e.target.checked ? setDuration(value) : null)}
              >
                <span>{label}</span>
              </RadioButton>
            ))}

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
