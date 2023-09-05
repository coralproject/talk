import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import Main from "coral-auth/components/Main";
import { HorizontalGutter, Typography } from "coral-ui/components/v2";

interface Props {
  email: string;
}

const CheckEmail: FunctionComponent<Props> = ({ email }) => (
  <div data-testid="forgotPassword-checkEmail-container">
    <Main data-testid="forgotPassword-checkEmail-main">
      <HorizontalGutter size="full">
        <Localized
          id="forgotPassword-checkEmail-receiveEmail"
          vars={{ email }}
          elems={{ strong: <strong /> }}
        >
          <Typography variant="bodyCopy">
            If there is an account associated with <strong>{email}</strong>, you
            will receive an email with a link to create a new password.
          </Typography>
        </Localized>
      </HorizontalGutter>
    </Main>
  </div>
);

export default CheckEmail;
