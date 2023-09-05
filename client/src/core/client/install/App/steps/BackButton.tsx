import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Button } from "coral-ui/components/v2";

export interface BackButtonProps {
  submitting: boolean;
  onGoToPreviousStep: () => void;
}

const BackButton: FunctionComponent<BackButtonProps> = ({
  submitting,
  onGoToPreviousStep,
}) => {
  return (
    <Localized id="install-backButton-back">
      <Button
        onClick={onGoToPreviousStep}
        variant="regular"
        color="mono"
        disabled={submitting}
      >
        Back
      </Button>
    </Localized>
  );
};

export default BackButton;
