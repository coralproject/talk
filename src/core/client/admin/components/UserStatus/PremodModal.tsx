import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import NotAvailable from "coral-admin/components/NotAvailable";
import { Button, Flex, HorizontalGutter } from "coral-ui/components/v2";

import ChangeStatusModal from "./ChangeStatusModal";
import ChangeStatusModalHeader from "./ChangeStatusModalHeader";
import ModalHeaderUsername from "./ModalHeaderUsername";

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
    <ChangeStatusModal
      open={open}
      onClose={onClose}
      aria-labelledby="PremodModal-title"
    >
      {({ lastFocusableRef }) => (
        <HorizontalGutter spacing={3}>
          <Localized
            id="community-premodModal-areYouSure"
            strong={<ModalHeaderUsername />}
            $username={username || <NotAvailable />}
          >
            <ChangeStatusModalHeader id="PremodModal-title">
              Are you sure you want to always premoderate{" "}
              <ModalHeaderUsername>
                {username || <NotAvailable />}
              </ModalHeaderUsername>
              ?
            </ChangeStatusModalHeader>
          </Localized>
          <Localized id="community-premodModal-consequence">
            <div className={styles.bodyText}>
              Note: Always premoderating this user will place all of their
              comments in the Pre-Moderate queue.
            </div>
          </Localized>
          <Flex justifyContent="flex-end" itemGutter>
            <Localized id="community-premodModal-cancel">
              <Button variant="flat" onClick={onClose}>
                Cancel
              </Button>
            </Localized>

            <Localized id="community-premodModal-premodUser">
              <Button onClick={onConfirm} ref={lastFocusableRef}>
                Yes, always premoderate user
              </Button>
            </Localized>
          </Flex>
        </HorizontalGutter>
      )}
    </ChangeStatusModal>
  );
};

export default PremodModal;
