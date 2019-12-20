import { Localized } from "@fluent/react/compat";
import React from "react";

import { HorizontalGutter, Typography } from "coral-ui/components";

const Success: React.FunctionComponent = () => {
  return (
    <HorizontalGutter data-testid="success" size="double">
      <Localized id="unsubscribe-successfullyUnsubscribed">
        <Typography variant="heading1">
          You are now unsubscribed from all notifications
        </Typography>
      </Localized>
    </HorizontalGutter>
  );
};

export default Success;
