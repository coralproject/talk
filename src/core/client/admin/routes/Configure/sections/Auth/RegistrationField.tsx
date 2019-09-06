import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  CheckBox,
  FormField,
  InputDescription,
  InputLabel,
} from "coral-ui/components";

interface Props {
  name: string;
  disabled: boolean;
}

const RegistrationField: FunctionComponent<Props> = ({ name, disabled }) => (
  <FormField>
    <Localized id="configure-auth-registration">
      <InputLabel>Registration</InputLabel>
    </Localized>
    <Localized id="configure-auth-registrationDescription">
      <InputDescription>
        Allow users to create a new account with this provider.
      </InputDescription>
    </Localized>
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
