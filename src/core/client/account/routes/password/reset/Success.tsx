import { Localized } from "fluent-react/compat";
import React from "react";

import { HorizontalGutter, Typography } from "coral-ui/components";

const Sorry: React.FunctionComponent = () => {
  return (
    <HorizontalGutter size="double">
      <Localized id="resetPassword-successfullyReset">
        <Typography variant="heading1">Password successfully reset</Typography>
      </Localized>
      <Localized id="resetPassword-youMayClose">
        <Typography variant="bodyCopy">
          You may now close this window and sign in to your account with your
          new password.
        </Typography>
      </Localized>
    </HorizontalGutter>
  );
};

export default Sorry;
