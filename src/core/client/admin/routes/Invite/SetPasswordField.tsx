import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validatePassword,
} from "coral-framework/lib/validation";
import {
  FormField,
  InputDescription,
  InputLabel,
  PasswordField,
} from "coral-ui/components";

interface Props {
  disabled: boolean;
}

const SetPasswordField: FunctionComponent<Props> = props => (
  <Field
    name="password"
    validate={composeValidators(required, validatePassword)}
  >
    {({ input, meta }) => (
      <FormField>
        <Localized id="invite-passwordLabel">
          <InputLabel htmlFor={input.name}>Password</InputLabel>
        </Localized>
        <Localized id="invite-passwordDescription" $minLength={8}>
          <InputDescription>
            {"Must be at least {$minLength} characters"}
          </InputDescription>
        </Localized>
        <Localized id="invite-passwordTextField" attrs={{ placeholder: true }}>
          <PasswordField
            id={input.name}
            placeholder="Password"
            autoComplete="new-password"
            color={colorFromMeta(meta)}
            disabled={props.disabled}
            fullWidth
            {...input}
          />
        </Localized>
        <ValidationMessage meta={meta} fullWidth />
      </FormField>
    )}
  </Field>
);

export default SetPasswordField;
