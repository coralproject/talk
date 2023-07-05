import cn from "classnames";
import React, { FunctionComponent, useCallback, useState } from "react";

import CLASSES from "coral-stream/classes";
import { Box } from "coral-ui/components/v2";

import CompletionPage from "./Pages/CompletionPage";
import ConfirmPage from "./Pages/ConfirmPage";
import DescriptionPage from "./Pages/DescriptionPage";
import DownloadCommentsPage from "./Pages/DownloadCommentsPage";
import WhenPage from "./Pages/WhenPage";

import styles from "./DeleteAccountModal.css";

interface Props {
  userID: string;
  scheduledDeletionDate?: string;
  organizationEmail: string;
  onClose: () => void;
}

const DeleteAccountModalContents: FunctionComponent<Props> = ({
  userID,
  onClose,
  scheduledDeletionDate,
  organizationEmail,
}) => {
  const [step, setStep] = useState(0);

  const closeModal = useCallback(() => {
    onClose();
  }, [onClose, setStep]);
  const incrementStep = useCallback(() => {
    setStep(step + 1);
  }, [step, setStep, closeModal]);

  return (
    <Box className={cn(styles.root, CLASSES.deleteMyAccountModal.$root)}>
      {step === 0 && (
        <DescriptionPage
          step={0}
          onProceed={incrementStep}
          onCancel={closeModal}
        />
      )}
      {step === 1 && (
        <WhenPage step={1} onProceed={incrementStep} onCancel={closeModal} />
      )}
      {step === 2 && (
        <DownloadCommentsPage
          step={2}
          onProceed={incrementStep}
          onCancel={closeModal}
        />
      )}
      {step === 3 && (
        <ConfirmPage step={3} onProceed={incrementStep} onCancel={closeModal} />
      )}
      {step === 4 && (
        <CompletionPage
          step={4}
          scheduledDeletionDate={scheduledDeletionDate}
          organizationEmail={organizationEmail}
          onClose={closeModal}
        />
      )}
    </Box>
  );
};

export default DeleteAccountModalContents;
