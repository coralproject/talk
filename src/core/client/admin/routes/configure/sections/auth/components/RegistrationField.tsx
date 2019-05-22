import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { CheckBox, FormField, InputLabel } from "coral-ui/components";

import ConfigDescription from "./ConfigDescription";

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
      <ConfigDescription>
        Allow users to create a new account with this provider.
      </ConfigDescription>
    </Localized>
    <FormField>
      <Field name={name} type="checkbox">
        {({ input }) => (
          <Localized id="configure-auth-registrationCheckBox">
            <CheckBox
              id={input.name}
              name={input.name}
              onChange={input.onChange}
              checked={input.value}
              disabled={disabled}
            >
              Allow Registration
            </CheckBox>
          </Localized>
        )}
      </Field>
    </FormField>
  </FormField>
);

export default RegistrationField;
