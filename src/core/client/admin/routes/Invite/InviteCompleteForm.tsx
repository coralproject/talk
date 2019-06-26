import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { useCallback, useMemo } from "react";
import { Form } from "react-final-form";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { parseJWT } from "coral-framework/lib/jwt";
import { useMutation } from "coral-framework/lib/relay";
import {
  Button,
  Flex,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

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
  const email = useMemo(() => parseJWT(token).payload.email, [token]);

  return (
    <div>
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Localized
          id="invite-youHaveBeenInvited"
          $organizationName={organizationName}
        >
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
        {({ handleSubmit, submitting }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <HorizontalGutter
              size="double"
              className={styles.root}
              paddingTop={4}
            >
              <HorizontalGutter>
                <SetUsernameField disabled={submitting} />
                <SetPasswordField disabled={submitting} />
                <Localized id="invite-createAccount">
                  <Button
                    type="submit"
                    variant="filled"
                    color="brand"
                    disabled={submitting}
                    fullWidth
                  >
                    Create Account
                  </Button>
                </Localized>
              </HorizontalGutter>
            </HorizontalGutter>
          </form>
        )}
      </Form>
    </div>
  );
};

export default InviteCompleteForm;
