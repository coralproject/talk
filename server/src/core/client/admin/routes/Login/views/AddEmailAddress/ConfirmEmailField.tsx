import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateEqualEmails,
} from "coral-framework/lib/validation";
import { FormField, InputLabel, TextField } from "coral-ui/components/v2";

interface Props {
  disabled: boolean;
}

const ConfirmEmailField: FunctionComponent<Props> = (props) => (
  <Field
    name="confirmEmail"
    validate={composeValidators(required, validateEqualEmails)}
  >
    {({ input, meta }) => (
      <FormField>
        <Localized id="addEmailAddress-confirmEmailAddressLabel">
          <InputLabel htmlFor={input.name}>Confirm Email Address</InputLabel>
        </Localized>
        <Localized
          id="addEmailAddress-confirmEmailAddressTextField"
          attrs={{ placeholder: true }}
        >
          <TextField
            {...input}
            id={input.name}
            placeholder="Confirm Email Address"
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

export default ConfirmEmailField;
