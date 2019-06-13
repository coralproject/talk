import { Localized } from "fluent-react/compat";
import React from "react";

import { HorizontalGutter, Typography } from "coral-ui/components";

const Success: React.FunctionComponent = () => {
  return (
    <HorizontalGutter size="double">
      <Localized id="confirmEmail-successfullyConfirmed">
        <Typography variant="heading1">Email successfully confirmed</Typography>
      </Localized>
      <Localized id="confirmEmail-youMayClose">
        <Typography variant="bodyCopy">
          You may now close this window.
        </Typography>
      </Localized>
    </HorizontalGutter>
  );
};

export default Success;
