import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { GQLUSER_ROLE } from "coral-framework/schema";
import { FieldSet, RadioButton, Typography } from "coral-ui/components";

const RoleField: FunctionComponent = () => (
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

export default RoleField;
