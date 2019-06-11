import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Button, ButtonIcon } from "coral-ui/components";

export interface NextButtonProps {
  submitting: boolean;
}

const NextButton: FunctionComponent<NextButtonProps> = props => {
  return (
    <Button
      variant="filled"
      color="primary"
      size="large"
      type="submit"
      disabled={props.submitting}
    >
      <Localized id="install-nextButton-next">
        <span>Next</span>
      </Localized>
      <ButtonIcon>arrow_forward</ButtonIcon>
    </Button>
  );
};

export default NextButton;
