import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Form, FormSpy } from "react-final-form";

import { useMutation } from "coral-framework/lib/relay";
import { GQLUSER_ROLE } from "coral-framework/schema";
import {
  Button,
  CallOut,
  Flex,
  HorizontalGutter,
  Typography,
} from "coral-ui/components";

import EmailField from "./EmailField";
import InviteUsersMutation from "./InviteUsersMutation";
import RoleField from "./RoleField";

interface Props {
  onFinish: () => void;
  lastRef?: React.Ref<HTMLButtonElement>;
}

const InviteForm: FunctionComponent<Props> = ({ lastRef, onFinish }) => {
  const [emailFieldCount, setEmailFieldCount] = useState(3);
  const inviteUsers = useMutation(InviteUsersMutation);
  const onSubmit = useCallback(
    async ({ role, emails = [] }) => {
      try {
        await inviteUsers({
          role,
          emails: emails.filter((email: string | null) => Boolean(email)),
        });
        onFinish();
      } catch (error) {
        return { [FORM_ERROR]: error.message };
      }
      return;
    },
    [inviteUsers, onFinish]
  );

  return (
    <Form onSubmit={onSubmit} initialValues={{ role: GQLUSER_ROLE.STAFF }}>
      {({ handleSubmit, submitting, submitError }) => (
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          id="community-invite-form"
        >
          <HorizontalGutter spacing={3}>
            {submitError && (
              <CallOut color="error" fullWidth>
                {submitError}
              </CallOut>
            )}
            {Array(emailFieldCount)
              .fill(0)
              .map((_, idx) => (
                <EmailField key={idx} index={idx} disabled={submitting} />
              ))}
            <Flex justifyContent="center">
              <Localized id="community-invite-inviteMore">
                <Button
                  variant="underlined"
                  color="primary"
                  disabled={submitting}
                  onClick={() => {
                    setEmailFieldCount(emailFieldCount + 1);
                  }}
                >
                  Invite more
                </Button>
              </Localized>
            </Flex>
            <RoleField disabled={submitting} />
            <FormSpy subscription={{ values: true }}>
              {({ values: { role } }) => {
                switch (role) {
                  case GQLUSER_ROLE.STAFF:
                    return (
                      <Localized
                        id="community-invite-role-staff"
                        strong={<strong />}
                      >
                        <Typography>
                          Staff role: Receives a “Staff” badge, and comments are
                          automatically approved. Cannot moderate or change any
                          Coral configuration.
                        </Typography>
                      </Localized>
                    );
                  case GQLUSER_ROLE.MODERATOR:
                    return (
                      <Localized
                        id="community-invite-role-moderator"
                        strong={<strong />}
                      >
                        <Typography>
                          Moderator role: Receives a “Staff” badge, and comments
                          are automatically approved. Has full moderation
                          privileges (approve, reject and feature comments). Can
                          configure individual articles but no site-wide
                          configuration privileges.
                        </Typography>
                      </Localized>
                    );
                  case GQLUSER_ROLE.ADMIN:
                    return (
                      <Localized
                        id="community-invite-role-admin"
                        strong={<strong />}
                      >
                        <Typography>
                          Admin role: Receives a “Staff” badge, and comments are
                          automatically approved. Has full moderation privileges
                          (approve, reject and feature comments). Can configure
                          individual articles and has site-wide configuration
                          privileges.
                        </Typography>
                      </Localized>
                    );
                  default:
                    return null;
                }
              }}
            </FormSpy>
            <Flex direction="row" justifyContent="flex-end">
              <Localized id="community-invite-sendInvitations">
                <Button
                  color="primary"
                  variant="filled"
                  type="submit"
                  disabled={submitting}
                  ref={lastRef}
                >
                  Send invitations
                </Button>
              </Localized>
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Form>
  );
};

export default InviteForm;
