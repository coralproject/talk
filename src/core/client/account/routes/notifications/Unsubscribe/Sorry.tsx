import { Localized } from "fluent-react/compat";
import React from "react";

import { CallOut, HorizontalGutter, Typography } from "coral-ui/components";

interface Props {
  reason: React.ReactNode;
}

const Sorry: React.FunctionComponent<Props> = ({ reason }) => {
  return (
    <HorizontalGutter size="double">
      <Localized id="unsubscribe-oopsSorry">
        <Typography variant="heading1">Oops Sorry!</Typography>
      </Localized>
      <CallOut color="error" fullWidth>
        {reason ? (
          reason
        ) : (
          <Localized id="account-tokenNotFound">
            <span data-testid="invalid-link">
              The specified link is invalid, check to see if it was copied
              correctly.
            </span>
          </Localized>
        )}
      </CallOut>
    </HorizontalGutter>
  );
};

export default Sorry;
