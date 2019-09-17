import {
  Button,
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
  Modal,
  Typography,
} from "coral-ui/components";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";

import styles from "./PremodModal.css";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PremodModal: FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
}) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="PremodModal-title">
      {({ firstFocusableRef, lastFocusableRef }) => (
        <Card className={styles.card}>
          <CardCloseButton onClick={onClose} ref={firstFocusableRef} />
          <HorizontalGutter size="double">
            <HorizontalGutter>
              <Localized
                id="community-premodModal-areYouSure"
                strong={<strong />}
                $username={username || <NotAvailable />}
              >
                <Typography variant="header2" id="PremodModal-title">
                  Are you sure you want to always premoderate{" "}
                  <strong>{username || <NotAvailable />}</strong>?
                </Typography>
              </Localized>
              <Localized id="community-premodModal-consequence">
                <Typography>
                  Note: Always premoderating this user will place all of their
                  comments in the Pre-Moderate queue.
                </Typography>
              </Localized>
            </HorizontalGutter>
            <Flex justifyContent="flex-end" itemGutter>
              <Localized id="community-premodModal-cancel">
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
              </Localized>

              <Localized id="community-premodModal-premodUser">
                <Button
                  variant="filled"
                  color="primary"
                  onClick={onConfirm}
                  ref={lastFocusableRef}
                >
                  Yes, always premoderate user
                </Button>
              </Localized>
            </Flex>
          </HorizontalGutter>
        </Card>
      )}
    </Modal>
  );
};

export default PremodModal;
