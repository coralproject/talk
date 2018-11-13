import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import {
  CheckBox,
  FormField,
  InputDescription,
  InputLabel,
} from "talk-ui/components";

interface Props {
  name: string;
  disabled: boolean;
}

import styles from "./RegistrationField.css";

const RegistrationField: StatelessComponent<Props> = ({ name, disabled }) => (
  <FormField>
    <Localized id="configure-auth-registration">
      <InputLabel>Registration</InputLabel>
    </Localized>
    <Localized id="configure-auth-registrationDescription">
      <InputDescription className={styles.description}>
        Allow users to create a new account with this provider.
      </InputDescription>
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
              Registration
            </CheckBox>
          </Localized>
        )}
      </Field>
    </FormField>
  </FormField>
);

export default RegistrationField;
