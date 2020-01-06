import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { PasswordField } from "coral-framework/components";
import {
  colorFromMeta,
  parseString,
  ValidationMessage,
} from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validatePassword,
} from "coral-framework/lib/validation";
import { FormField, InputDescription, InputLabel } from "coral-ui/components";

interface Props {
  disabled: boolean;
}

const SetPasswordField: FunctionComponent<Props> = props => (
  <Field
    name="password"
    validate={composeValidators(required, validatePassword)}
    parse={parseString}
  >
    {({ input, meta }) => (
      <FormField>
        <Localized id="general-passwordLabel">
          <InputLabel htmlFor={input.name}>Password</InputLabel>
        </Localized>
        <Localized id="general-passwordDescription" $minLength={8}>
          <InputDescription>
            {"Must be at least {$minLength} characters"}
          </InputDescription>
        </Localized>
        <Localized id="general-passwordTextField" attrs={{ placeholder: true }}>
          <PasswordField
            {...input}
            id={input.name}
            placeholder="Password"
            color={colorFromMeta(meta)}
            disabled={props.disabled}
            fullWidth
          />
        </Localized>
        <ValidationMessage meta={meta} fullWidth />
      </FormField>
    )}
  </Field>
);

export default SetPasswordField;
