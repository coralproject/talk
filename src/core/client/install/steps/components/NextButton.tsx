import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Button, ButtonIcon } from "talk-ui/components";

export interface NextButtonProps {
  submitting: boolean;
}

const NextButton: StatelessComponent<NextButtonProps> = props => {
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
