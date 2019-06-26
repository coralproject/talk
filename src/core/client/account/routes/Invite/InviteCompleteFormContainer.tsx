import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { useCallback, useMemo } from "react";
import { Form } from "react-final-form";

import { InviteCompleteFormContainer_settings } from "coral-account/__generated__/InviteCompleteFormContainer_settings.graphql";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { parseJWT } from "coral-framework/lib/jwt";
import {
  graphql,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { Button, HorizontalGutter, Typography } from "coral-ui/components";

import InviteCompleteMutation from "./InviteCompleteMutation";
import SetPasswordField from "./SetPasswordField";
import SetUsernameField from "./SetUsernameField";

interface Props {
  token: string;
  settings: InviteCompleteFormContainer_settings;
  disabled?: boolean;
  onSuccess: () => void;
}

interface FormProps {
  username: string;
  password: string;
}

const InviteCompleteFormContainer: React.FunctionComponent<Props> = ({
  onSuccess,
  token,
  settings,
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
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, submitting }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <HorizontalGutter size="double">
              <HorizontalGutter>
                <Localized
                  id="invite-youHaveBeenInvited"
                  $organizationName={settings.organization.name}
                >
                  <Typography variant="heading1">
                    You've been invited to join {settings.organization.name}
                  </Typography>
                </Localized>
                <Localized
                  id="invite-finishSettingUpAccount"
                  $email={email}
                  strong={<strong />}
                >
                  <Typography variant="bodyCopy">
                    Finish setting up the account for: <strong>{email}</strong>
                  </Typography>
                </Localized>
              </HorizontalGutter>
              <HorizontalGutter>
                <SetUsernameField disabled={submitting} />
                <SetPasswordField disabled={submitting} />
                <Localized id="invite-createAccount">
                  <Button
                    type="submit"
                    variant="filled"
                    color="primary"
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

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment InviteCompleteFormContainer_settings on Settings {
      organization {
        name
      }
    }
  `,
})(InviteCompleteFormContainer);

export default enhanced;
