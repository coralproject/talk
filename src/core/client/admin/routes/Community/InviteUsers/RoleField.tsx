import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { GQLUSER_ROLE } from "coral-framework/schema";
import { FieldSet, RadioButton } from "coral-ui/components/v2";

import styles from "./RoleField.css";

interface Props {
  disabled: boolean;
}

const RoleField: FunctionComponent<Props> = ({ disabled }) => (
  <FieldSet>
    <Localized id="community-invite-inviteAsLabel">
      <legend className={styles.legend}>Invite as:</legend>
    </Localized>
    <div>
      <Field name="role" type="radio" value={GQLUSER_ROLE.STAFF}>
        {({ input }) => (
          <Localized id="role-staff">
            <RadioButton
              {...input}
              id={`${input.name}-staff`}
              disabled={disabled}
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
              {...input}
              id={`${input.name}-moderator`}
              disabled={disabled}
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
              {...input}
              id={`${input.name}-admin`}
              disabled={disabled}
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
