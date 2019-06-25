import React, { FunctionComponent, useCallback, useState } from "react";
import { Field, Form, FormSpy } from "react-final-form";

import { GQLUSER_ROLE } from "coral-framework/schema";
import {
  Button,
  Card,
  CardCloseButton,
  FieldSet,
  Flex,
  HorizontalGutter,
  Modal,
  RadioButton,
  TextField,
  Typography,
} from "coral-ui/components";

import { Localized } from "fluent-react/compat";
import * as styles from "./InvitePopover.css";

const EmailField: FunctionComponent<{ index: number }> = ({ index }) => (
  <FieldSet>
    <Localized id="community-invite-emailAddressLabel">
      <Typography container="legend" variant="bodyCopyBold">
        Email address:
      </Typography>
    </Localized>
    <Field name={`emails.${index}`}>
      {({ input }) => (
        <TextField
          name={input.name}
          onChange={input.onChange}
          value={input.value}
          fullWidth
        />
      )}
    </Field>
  </FieldSet>
);

const RoleField = () => (
  <FieldSet>
    <Localized id="community-invite-inviteAsLabel">
      <Typography container="legend" variant="bodyCopyBold">
        Invite as:
      </Typography>
    </Localized>
    <div>
      <Field name="role" type="radio" value={GQLUSER_ROLE.STAFF}>
        {({ input }) => (
          <Localized id="role-staff">
            <RadioButton
              id={`${input.name}-staff`}
              name={input.name}
              onChange={input.onChange}
              onFocus={input.onFocus}
              onBlur={input.onBlur}
              checked={input.checked}
              value={input.value}
            >
              Staff
            </RadioButton>
          </Localized>
        )}
      </Field>
      <Field name="role" type="radio" value={GQLUSER_ROLE.MODERATOR}>
        {({ input }) => (
          <Localized id="role-moderator">
            <RadioButton
              id={`${input.name}-moderator`}
              name={input.name}
              onChange={input.onChange}
              onFocus={input.onFocus}
              onBlur={input.onBlur}
              checked={input.checked}
              value={input.value}
            >
              Moderator
            </RadioButton>
          </Localized>
        )}
      </Field>
      <Field name="role" type="radio" value={GQLUSER_ROLE.ADMIN}>
        {({ input }) => (
          <Localized id="role-admin">
            <RadioButton
              id={`${input.name}-admin`}
              name={input.name}
              onChange={input.onChange}
              onFocus={input.onFocus}
              onBlur={input.onBlur}
              checked={input.checked}
              value={input.value}
            >
              Admin
            </RadioButton>
          </Localized>
        )}
      </Field>
    </div>
  </FieldSet>
);

const InviteForm: FunctionComponent<{
  onClose: () => void;
  lastRef?: React.Ref<HTMLButtonElement>;
}> = ({ onClose, lastRef }) => {
  const [emailFieldCount, setEmailFieldCount] = useState(3);

  return (
    <Form
      onSubmit={() => {
        // FIXME: (wyattjoh) implement
        onClose();
      }}
      initialValues={{ role: "STAFF" }}
    >
      {({ handleSubmit }) => (
        <form
          autoComplete="off"
          onSubmit={handleSubmit}
          id="community-invite-form"
        >
          <HorizontalGutter spacing={3}>
            {Array(emailFieldCount)
              .fill(0)
              .map((_, idx) => (
                <EmailField key={idx} index={idx} />
              ))}
            <Flex justifyContent="center">
              <Localized id="community-invite-inviteMore">
                <Button
                  variant="underlined"
                  color="primary"
                  onClick={() => {
                    setEmailFieldCount(emailFieldCount + 1);
                  }}
                >
                  Invite more
                </Button>
              </Localized>
            </Flex>
            <RoleField />
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
                          Moderator role: Moderator role: Receives a “Staff”
                          badge, and comments are automatically approved. Has
                          full moderation privileges (approve, reject and
                          feature comments). Can configure individual articles
                          but no site-wide configuration privileges.
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

export const InvitePopover: FunctionComponent<{}> = () => {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  return (
    <div>
      <Button variant="filled" color="primary" type="button" onClick={show}>
        Invite
      </Button>
      <Modal open={open}>
        {({ firstFocusableRef, lastFocusableRef }) => (
          <Card className={styles.root}>
            <HorizontalGutter spacing={3}>
              <div>
                <CardCloseButton onClick={hide} ref={firstFocusableRef} />
                <Localized id="community-invite-inviteMember">
                  <Typography variant="header2">
                    Invite members to your organization
                  </Typography>
                </Localized>
              </div>
              <InviteForm onClose={hide} lastRef={lastFocusableRef} />
            </HorizontalGutter>
          </Card>
        )}
      </Modal>
    </div>
  );
};
