import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Button } from "talk-ui/components";

export interface BackButtonProps {
  submitting: boolean;
  onGoToPreviousStep: () => void;
}

const BackButton: StatelessComponent<BackButtonProps> = ({
  submitting,
  onGoToPreviousStep,
}) => {
  return (
    <Localized id="install-backButton-back">
      <Button
        onClick={onGoToPreviousStep}
        variant="filled"
        color="regular"
        size="large"
        disabled={submitting}
      >
        Back
      </Button>
    </Localized>
  );
};

export default BackButton;
