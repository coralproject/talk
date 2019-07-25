import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import {
  Button,
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
  Modal,
  Typography,
} from "coral-ui/components";

import styles from "./BanModal.css";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  duration: string;
}

const SuspendSuccessModal: FunctionComponent<Props> = ({
  open,
  onClose,
  username,
  duration,
}) => (
  <Modal open={open} onClose={onClose} aria-labelledby="banModal-title">
    {({ firstFocusableRef, lastFocusableRef }) => (
      <Card className={styles.card}>
        <CardCloseButton onClick={onClose} ref={firstFocusableRef} />
        <HorizontalGutter size="double">
          <HorizontalGutter>
            <Localized
              id="community-suspendModal-success"
              $username={username}
              strong={<strong />}
              $duration={duration}
            >
              <Typography>
                <strong>{username}</strong> has been suspended for{" "}
                <strong>{duration}</strong>
              </Typography>
            </Localized>
          </HorizontalGutter>
          <Flex justifyContent="flex-end" itemGutter="half">
            <Localized id="community-suspendModal-success-close">
              <Button
                variant="filled"
                color="primary"
                onClick={onClose}
                ref={lastFocusableRef}
              >
                Ok
              </Button>
            </Localized>
          </Flex>
        </HorizontalGutter>
      </Card>
    )}
  </Modal>
);

export default SuspendSuccessModal;
