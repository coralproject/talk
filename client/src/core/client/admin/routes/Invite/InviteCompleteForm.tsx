import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { useCallback, useMemo } from "react";
import { Form } from "react-final-form";

import { parseAccessTokenClaims } from "coral-framework/lib/auth/helpers";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useMutation } from "coral-framework/lib/relay";
import {
  Button,
  CallOut,
  Flex,
  HorizontalGutter,
  Typography,
} from "coral-ui/components/v2";

import InviteCompleteMutation from "./InviteCompleteMutation";
import SetPasswordField from "./SetPasswordField";
import SetUsernameField from "./SetUsernameField";

import styles from "./InviteCompleteForm.css";

interface Props {
  token: string;
  organizationName: string;
  onSuccess: () => void;
}

interface FormProps {
  username: string;
  password: string;
}

const InviteCompleteForm: React.FunctionComponent<Props> = ({
  onSuccess,
  token,
  organizationName,
}) => {
  const completeInvite = useMutation(InviteCompleteMutation);
  const onSubmit = useCallback(
    async ({ username, password }: FormProps) => {
      try {
        await completeInvite({ username, token, password });
        onSuccess();
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          return error.invalidArgs;
        }
        return { [FORM_ERROR]: error.message };
      }
      return;
    },
    [token]
  );
  const email = useMemo(() => {
    const claims = parseAccessTokenClaims<{ email?: string }>(token);
    if (!claims) {
      return null;
    }

    return claims.email;
  }, [token]);

  return (
    <div data-testid="invite-complete-form">
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Localized id="invite-youHaveBeenInvited" vars={{ organizationName }}>
          <Typography variant="heading1">
            You've been invited to join {organizationName}
          </Typography>
        </Localized>
        <Localized id="invite-finishSettingUpAccount">
          <Typography variant="bodyCopy">
            Finish setting up the account for:
          </Typography>
        </Localized>
        <Typography variant="heading2">{email}</Typography>
      </Flex>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting, submitError }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <HorizontalGutter
              size="double"
              className={styles.root}
              paddingTop={4}
            >
              {submitError && (
                <CallOut color="error" fullWidth>
                  {submitError}
                </CallOut>
              )}
              <SetUsernameField disabled={submitting} />
              <SetPasswordField disabled={submitting} />
              <Localized id="invite-createAccount">
                <Button
                  type="submit"
                  variant="regular"
                  color="regular"
                  disabled={submitting}
                  fullWidth
                >
                  Create Account
                </Button>
              </Localized>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </div>
  );
};

export default InviteCompleteForm;
