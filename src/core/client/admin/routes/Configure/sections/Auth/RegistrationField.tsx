import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { CheckBox, FormField, Label } from "coral-admin/ui/components";
import { HorizontalGutter } from "coral-ui/components";
import HelperText from "../../HelperText";

interface Props {
  name: string;
  disabled: boolean;
}

const RegistrationField: FunctionComponent<Props> = ({ name, disabled }) => (
  <FormField>
    <HorizontalGutter spacing={1}>
      <Localized id="configure-auth-registration">
        <Label>Registration</Label>
      </Localized>
      <Localized id="configure-auth-registrationDescription">
        <HelperText>
          Allow users to create a new account with this provider.
        </HelperText>
      </Localized>
    </HorizontalGutter>
    <FormField>
      <Field name={name} type="checkbox">
        {({ input }) => (
          <Localized id="configure-auth-registrationCheckBox">
            <CheckBox id={input.name} disabled={disabled} {...input}>
              Allow Registration
            </CheckBox>
          </Localized>
        )}
      </Field>
    </FormField>
  </FormField>
);

export default RegistrationField;
