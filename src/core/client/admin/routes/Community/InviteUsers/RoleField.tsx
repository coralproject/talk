import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { GQLUSER_ROLE } from "coral-framework/schema";
import { FieldSet, Label } from "coral-ui/components/v2";
import RadioButton from "./Fields/RadioButton";

interface Props {
  disabled: boolean;
}

const RoleField: FunctionComponent<Props> = ({ disabled }) => (
  <FieldSet>
    <Localized id="community-invite-inviteAsLabel">
      <Label>Invite as:</Label>
    </Localized>
    <div>
      <Localized id="role-staff">
        <RadioButton
          name="role"
          id={`role-staff`}
          value={GQLUSER_ROLE.STAFF}
          disabled={disabled}
        >
          Staff
        </RadioButton>
      </Localized>
      <Localized id="role-moderator">
        <RadioButton
          name="role"
          id={`role-moderator`}
          disabled={disabled}
          value={GQLUSER_ROLE.MODERATOR}
        >
          Moderator
        </RadioButton>
      </Localized>
      <Localized id="role-admin">
        <RadioButton
          name="role"
          id={`role-admin`}
          disabled={disabled}
          value={GQLUSER_ROLE.ADMIN}
        >
          Admin
        </RadioButton>
      </Localized>
    </div>
  </FieldSet>
);

export default RoleField;
