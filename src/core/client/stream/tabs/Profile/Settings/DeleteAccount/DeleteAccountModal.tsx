import React, { FunctionComponent, useCallback } from "react";

import { Modal } from "coral-ui/components/v2";

import DeleteAccountModalContents from "./DeleteAccountModalContents";

interface Props {
  userID: string;
  scheduledDeletionDate?: string | null;
  organizationEmail: string;
  open: boolean;
  onClose: () => void;
}

const DeleteAccountModal: FunctionComponent<Props> = ({
  userID,
  open = false,
  onClose,
  scheduledDeletionDate,
  organizationEmail,
}) => {
  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      <Modal
        open={open}
        onClose={closeModal}
        data-testid="delete-account-modal"
      >
        <DeleteAccountModalContents
          userID={userID}
          onClose={onClose}
          scheduledDeletionDate={scheduledDeletionDate || undefined}
          organizationEmail={organizationEmail}
        />
      </Modal>
    </>
  );
};

export default DeleteAccountModal;
