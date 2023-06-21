import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Button } from "coral-ui/components/v2";
import { ArrowRightIcon, ButtonSvgIcon } from "coral-ui/components/icons";

export interface NextButtonProps {
  submitting: boolean;
}

const NextButton: FunctionComponent<NextButtonProps> = (props) => {
  return (
    <Button
      variant="regular"
      color="regular"
      type="submit"
      disabled={props.submitting}
    >
      <Localized id="install-nextButton-next">
        <span>Next</span>
      </Localized>
      <ButtonSvgIcon size="xs" Icon={ArrowRightIcon} />
    </Button>
  );
};

export default NextButton;
