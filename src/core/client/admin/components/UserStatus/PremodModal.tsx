import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import {
  Button,
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
  Modal,
} from "coral-ui/components/v2";

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
          <HorizontalGutter spacing={3}>
            <Localized
              id="community-premodModal-areYouSure"
              strong={<strong />}
              $username={username || <NotAvailable />}
            >
              <h2 className={styles.title} id="PremodModal-title">
                Are you sure you want to always premoderate{" "}
                <strong>{username || <NotAvailable />}</strong>?
              </h2>
            </Localized>
            <Localized id="community-premodModal-consequence">
              <div className={styles.bodyText}>
                Note: Always premoderating this user will place all of their
                comments in the Pre-Moderate queue.
              </div>
            </Localized>
            <Flex justifyContent="flex-end" itemGutter>
              <Localized id="community-premodModal-cancel">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </Localized>

              <Localized id="community-premodModal-premodUser">
                <Button
                  variant="filled"
                  color="default"
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
