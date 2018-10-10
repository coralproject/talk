import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Button, ButtonIcon } from "talk-ui/components";

import * as styles from "./NextButton.css";

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
      <Localized id="install-next">
        <span>Next</span>
      </Localized>
      <ButtonIcon className={styles.root}>arrow_forward</ButtonIcon>
    </Button>
  );
};

export default NextButton;
