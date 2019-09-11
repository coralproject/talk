import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import Main from "coral-auth/components/Main";
import { HorizontalGutter, Typography } from "coral-ui/components";

interface Props {
  email: string;
}

const CheckEmail: FunctionComponent<Props> = ({ email }) => {
  const UserEmail = () => <strong>{email}</strong>;
  return (
    <div data-testid="forgotPassword-checkEmail-container">
      <Main data-testid="forgotPassword-checkEmail-main">
        <HorizontalGutter size="full">
          <Localized
            id="forgotPassword-checkEmail-receiveEmail"
            email={<UserEmail />}
          >
            <Typography variant="bodyCopy">
              {
                "If there is an account associated with <email></email>, you will receive an email with a link to create a new password."
              }
            </Typography>
          </Localized>
        </HorizontalGutter>
      </Main>
    </div>
  );
};

export default CheckEmail;
