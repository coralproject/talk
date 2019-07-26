import { Localized } from "fluent-react/compat";

import { Format, withFormat } from "coral-framework/lib/i18n";
import React, { FunctionComponent, useState } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import {
  Button,
  Card,
  CardCloseButton,
  CheckBox,
  Flex,
  HorizontalGutter,
  Modal,
  RadioButton,
  Typography,
} from "coral-ui/components";
import SuspendSuccessModal from "./SuspendSuccessModal";

import styles from "./SuspendModal.css";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  onSuccessClose: () => void;
  onConfirm: (timeout: number, message: string) => void;
  format: Format;
  organizationName: string;
  success: boolean;
}

const DURATIONS: Array<[string, string]> = [
  ["3600", "1 hour"],
  ["10800", "3 hours"],
  ["86400", "24 hours"],
  ["604800", "7 days"],
];

const DEFAULT_DURATION_INDEX = 1;

const SuspendModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
  format,
  success,
  onSuccessClose,
  organizationName,
}) => {
  function getMessageWithDuration(index: number): string {
    return format("community-suspendModal-emailTemplate", {
      username,
      organizationName,
      duration: DURATIONS[index][1],
    });
  }
  const [showMessage, setShowMessage] = useState(false);
  const [durationIndex, setDurationIndex] = useState(DEFAULT_DURATION_INDEX);
  const [messageDirty, setMessageDirty] = useState(false);
  const [emailMessage, setEmailMessage] = useState(
    getMessageWithDuration(DEFAULT_DURATION_INDEX)
  );

  function selectDuration(index: number): void {
    setDurationIndex(index);
    if (!messageDirty) {
      setEmailMessage(getMessageWithDuration(index));
    }
  }

  return (
    <>
      <SuspendSuccessModal
        username={username}
        onClose={() => onSuccessClose()}
        open={success}
        duration={DURATIONS[durationIndex][1]}
      />
      <Modal
        open={open}
        onClose={() => {
          onClose();
          setDurationIndex(DEFAULT_DURATION_INDEX);
          setEmailMessage(getMessageWithDuration(DEFAULT_DURATION_INDEX));
        }}
        aria-labelledby="suspendModal-title"
      >
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
              <Localized id="community-suspendModal-consequence">
                <Typography>
                  While suspended, this user will no longer be able to comment,
                  use reactions, or report comments.
                </Typography>
              </Localized>

              <Localized id="community-suspendModal-selectDuration">
                <Typography variant="header3">
                  Select suspension length
                </Typography>
              </Localized>

              <HorizontalGutter size="half">
                {DURATIONS.map(([value, label], index) => (
                  <RadioButton
                    key={value}
                    className={styles.radioButton}
                    id={`duration-${value}`}
                    name="duration"
                    value={DURATIONS[durationIndex][0]}
                    checked={durationIndex === index}
                    onChange={e =>
                      e.target.checked ? selectDuration(index) : null
                    }
                  >
                    <Localized id={`community-suspendModal-duration-${value}`}>
                      <span>{label}</span>
                    </Localized>
                  </RadioButton>
                ))}
              </HorizontalGutter>

              <Localized id="community-suspendModal-customize">
                <CheckBox
                  id="suspend-edit-message"
                  name="suspend-edit-message"
                  checked={showMessage}
                  onChange={e => {
                    setShowMessage(e.target.checked);
                  }}
                >
                  Customize suspension email message
                </CheckBox>
              </Localized>

              {showMessage && (
                <textarea
                  id="suspendModal-message"
                  value={emailMessage}
                  className={styles.textArea}
                  onChange={e => {
                    setEmailMessage(e.target.value);
                    setMessageDirty(true);
                  }}
                />
              )}

              <Flex justifyContent="flex-end" itemGutter="half">
                <Localized id="community-suspendModal-cancel">
                  <Button variant="outlined" onClick={onClose}>
                    Cancel
                  </Button>
                </Localized>
                <Localized id="community-suspendModal-suspendUser">
                  <Button
                    variant="filled"
                    color="primary"
                    onClick={() =>
                      onConfirm(
                        parseInt(DURATIONS[durationIndex][0], 10),
                        emailMessage
                      )
                    }
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
    </>
  );
};

const enhanced = withFormat(SuspendModal);

export default enhanced;
