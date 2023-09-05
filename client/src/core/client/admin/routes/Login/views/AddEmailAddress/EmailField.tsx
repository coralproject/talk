import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateEmail,
} from "coral-framework/lib/validation";
import { FormField, InputLabel, TextField } from "coral-ui/components/v2";

interface Props {
  disabled: boolean;
}

const EmailField: FunctionComponent<Props> = (props) => (
  <Field name="email" validate={composeValidators(required, validateEmail)}>
    {({ input, meta }) => (
      <FormField>
        <Localized id="addEmailAddress-emailAddressLabel">
          <InputLabel htmlFor={input.name}>Email Address</InputLabel>
        </Localized>
        <Localized
          id="addEmailAddress-emailAddressTextField"
          attrs={{ placeholder: true }}
        >
          <TextField
            {...input}
            id={input.name}
            placeholder="Email Address"
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

export default EmailField;
