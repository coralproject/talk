import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  CheckBox,
  FormField,
  FormFieldHeader,
  Label,
} from "coral-ui/components/v2";

import HelperText from "../../HelperText";

interface Props {
  name: string;
  disabled: boolean;
}

const RegistrationField: FunctionComponent<Props> = ({ name, disabled }) => (
  <FormField>
    <FormFieldHeader>
      <Localized id="configure-auth-registration">
        <Label>Registration</Label>
      </Localized>
      <Localized id="configure-auth-registrationDescription">
        <HelperText>
          Allow users to create a new account with this provider.
        </HelperText>
      </Localized>
    </FormFieldHeader>
    <FormField>
      <Field name={name} type="checkbox">
        {({ input }) => (
          <Localized id="configure-auth-registrationCheckBox">
            <CheckBox {...input} id={input.name} disabled={disabled}>
              Allow Registration
            </CheckBox>
          </Localized>
        )}
      </Field>
    </FormField>
  </FormField>
);

export default RegistrationField;
