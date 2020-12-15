import { Localized } from "@fluent/react/compat";
import { FieldArray, Formik } from "formik";
import React, { FunctionComponent, useCallback } from "react";

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
import StaffRoles from "./StaffRoles";

interface Props {
  onFinish: () => void;
  lastRef?: React.Ref<HTMLButtonElement>;
}

const InviteForm: FunctionComponent<Props> = ({ lastRef, onFinish }) => {
  const inviteUsers = useMutation(InviteUsersMutation);
  const onSubmit = useCallback(
    async ({ role, emails = [] }, actions) => {
      try {
        await inviteUsers({
          role,
          emails: emails.filter((email: string | null) => !!email),
        });
        onFinish();
      } catch (error) {
        actions.setStatus({
          error: error.message,
        });
      }
      return;
    },
    [inviteUsers, onFinish]
  );

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{ role: GQLUSER_ROLE.STAFF, emails: ["", "", ""] }}
    >
      {({ handleSubmit, values, isSubmitting, status }) => (
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          id="community-invite-form"
        >
          <HorizontalGutter spacing={3}>
            {status && status.error && (
              <CallOut color="error" fullWidth>
                {status.error}
              </CallOut>
            )}
            <FieldArray name="emails">
              {({ push }) => (
                <HorizontalGutter>
                  {values.emails.length > 0 &&
                    values.emails.map((email: string, index: number) => (
                      <EmailField
                        key={index}
                        index={index}
                        disabled={isSubmitting}
                      />
                    ))}
                  <Flex justifyContent="center">
                    <Localized id="community-invite-inviteMore">
                      <Button
                        disabled={isSubmitting}
                        onClick={() => {
                          push("");
                        }}
                      >
                        Invite more
                      </Button>
                    </Localized>
                  </Flex>
                </HorizontalGutter>
              )}
            </FieldArray>
            <RoleField disabled={isSubmitting} />
            <StaffRoles />
            <Flex direction="row" justifyContent="flex-end">
              <Localized id="community-invite-sendInvitations">
                <Button type="submit" disabled={isSubmitting} ref={lastRef}>
                  Send invitations
                </Button>
              </Localized>
            </Flex>
          </HorizontalGutter>
        </form>
      )}
    </Formik>
  );
};

export default InviteForm;
