import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import NotAvailable from "talk-admin/components/NotAvailable";
import {
  Button,
  Card,
  CardCloseButton,
  Flex,
  HorizontalGutter,
  Modal,
  Typography,
} from "talk-ui/components";

import styles from "./BanModal.css";

interface Props {
  username: string | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const BanModal: StatelessComponent<Props> = ({
  open,
  onClose,
  onConfirm,
  username,
}) => (
  <Modal open={open} onClose={onClose} aria-labelledby="banModal-title">
    {({ firstFocusableRef, lastFocusableRef }) => (
      <Card className={styles.card}>
        <CardCloseButton onClick={onClose} ref={firstFocusableRef} />
        <HorizontalGutter size="double">
          <HorizontalGutter>
            <Localized
              id="community-banModal-areYouSure"
              strong={<strong />}
              username={username || <NotAvailable />}
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
                onClick={onConfirm}
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

export default BanModal;
