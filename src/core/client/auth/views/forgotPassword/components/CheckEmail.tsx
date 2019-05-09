import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Bar, Title } from "talk-auth/components/Header";
import Main from "talk-auth/components/Main";
import { Button, HorizontalGutter, Typography } from "talk-ui/components";

interface Props {
  email: string;
}

const CheckEmail: FunctionComponent<Props> = ({ email }) => {
  const closeWindow = useCallback(() => {
    window.close();
  }, []);
  const UserEmail = () => <strong>{email}</strong>;
  return (
    <div data-testid="forgotPassword-checkEmail-container">
      <Bar>
        <Localized id="forgotPassword-checkEmail-checkEmailHeader">
          <Title>Check Your Email</Title>
        </Localized>
      </Bar>
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
          <Localized id="forgotPassword-checkEmail-closeButton">
            <Button
              variant="filled"
              color="primary"
              size="large"
              fullWidth
              type="submit"
              onClick={closeWindow}
            >
              Close
            </Button>
          </Localized>
        </HorizontalGutter>
      </Main>
    </div>
  );
};

export default CheckEmail;
