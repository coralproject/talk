import React, { FunctionComponent, useCallback, useState } from "react";

import { Box, Modal } from "coral-ui/components";

import CompletionPage from "./Pages/CompletionPage";
import ConfirmPage from "./Pages/ConfirmPage";
import DescriptionPage from "./Pages/DescriptionPage";
import DownloadCommentsPage from "./Pages/DownloadCommentsPage";
import WhenPage from "./Pages/WhenPage";

import styles from "./DeleteAccountModal.css";

interface Props {
  userID: string;
  open: boolean;
  onClose: () => void;
}

const DeleteAccountModal: FunctionComponent<Props> = ({
  userID,
  open = false,
  onClose,
}) => {
  const [step, setStep] = useState(0);

  const closeModal = useCallback(() => {
    setStep(0);
    onClose();
  }, [onClose, setStep]);
  const incrementStep = useCallback(() => {
    setStep(step + 1);
  }, [step, setStep, closeModal]);

  return (
    <>
      <Modal open={open} onClose={closeModal}>
        <Box className={styles.root}>
          {step === 0 && (
            <DescriptionPage
              step={0}
              onProceed={incrementStep}
              onCancel={closeModal}
            />
          )}
          {step === 1 && (
            <WhenPage
              step={1}
              onProceed={incrementStep}
              onCancel={closeModal}
            />
          )}
          {step === 2 && (
            <DownloadCommentsPage
              step={2}
              onProceed={incrementStep}
              onCancel={closeModal}
            />
          )}
          {step === 3 && (
            <ConfirmPage
              step={3}
              onProceed={incrementStep}
              onCancel={closeModal}
            />
          )}
          {step === 4 && <CompletionPage step={4} onClose={closeModal} />}
        </Box>
      </Modal>
    </>
  );
};

export default DeleteAccountModal;
