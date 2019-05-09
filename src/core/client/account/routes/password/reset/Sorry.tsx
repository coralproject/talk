import { Localized } from "fluent-react/compat";
import React from "react";

import { CallOut, HorizontalGutter, Typography } from "talk-ui/components";

interface Props {
  reason: React.ReactNode;
}

const Sorry: React.FunctionComponent<Props> = ({ reason }) => {
  return (
    <HorizontalGutter size="double">
      <Localized id="resetPassword-oopsSorry">
        <Typography variant="heading1">Oops Sorry!</Typography>
      </Localized>
      <CallOut color="error" fullWidth>
        {reason}
      </CallOut>
    </HorizontalGutter>
  );
};

export default Sorry;
