import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";
import { Form, FormSpy } from "react-final-form";

import { useMutation } from "coral-framework/lib/relay";
import { GQLUSER_ROLE } from "coral-framework/schema";
import {
  Button,
  CallOut,
  Flex,
  HorizontalGutter,
} from "coral-ui/components/v2";

import EmailField from "./EmailField";
import InviteUsersMutation from "./InviteUsersMutation";
import RoleField from "./RoleField";

import styles from "./InviteUsersForm.css";

interface Props {
  onFinish: () => void;
  lastRef?: React.Ref<HTMLButtonElement>;
}

const InviteForm: FunctionComponent<Props> = ({ lastRef, onFinish }) => {
  const [emailFieldCount, setEmailFieldCount] = useState(3);
  const inviteUsers = useMutation(InviteUsersMutation);
  const onSubmit = useCallback(
    async ({ role, emails = [] }: { role: GQLUSER_ROLE; emails: string[] }) => {
      try {
        await inviteUsers({
          role,
          emails: emails.filter((email: string | null) => !!email),
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
                        elems={{ strong: <strong /> }}
                      >
                        <div className={styles.bodyText}>
                          Staff role: Receives a “Staff” badge, and comments are
                          automatically approved. Cannot moderate or change any
                          Coral configuration.
                        </div>
                      </Localized>
                    );
                  case GQLUSER_ROLE.MODERATOR:
                    return (
                      <Localized
                        id="community-invite-role-moderator"
                        elems={{ strong: <strong /> }}
                      >
                        <div className={styles.bodyText}>
                          Moderator role: Receives a “Staff” badge, and comments
                          are automatically approved. Has full moderation
                          privileges (approve, reject and feature comments). Can
                          configure individual articles but no site-wide
                          configuration privileges.
                        </div>
                      </Localized>
                    );
                  case GQLUSER_ROLE.ADMIN:
                    return (
                      <Localized
                        id="community-invite-role-admin"
                        elems={{ strong: <strong /> }}
                      >
                        <div className={styles.bodyText}>
                          Admin role: Receives a “Staff” badge, and comments are
                          automatically approved. Has full moderation privileges
                          (approve, reject and feature comments). Can configure
                          individual articles and has site-wide configuration
                          privileges.
                        </div>
                      </Localized>
                    );
                  default:
                    return null;
                }
              }}
            </FormSpy>
            <Flex direction="row" justifyContent="flex-end">
              <Localized id="community-invite-sendInvitations">
                <Button type="submit" disabled={submitting} ref={lastRef}>
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
