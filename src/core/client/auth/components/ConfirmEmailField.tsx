import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { streamColorFromMeta } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateEqualEmails,
} from "coral-framework/lib/validation";
import { FormField, InputLabel, TextField } from "coral-ui/components/v2";
import { ValidationMessage } from "coral-ui/components/v3";

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
        <Localized id="general-confirmEmailAddressLabel">
          <InputLabel htmlFor={input.name}>Confirm Email Address</InputLabel>
        </Localized>
        <Localized
          id="general-confirmEmailAddressTextField"
          attrs={{ placeholder: true }}
        >
          <TextField
            {...input}
            id={input.name}
            placeholder="Confirm Email Address"
            color={streamColorFromMeta(meta)}
            disabled={props.disabled}
            fullWidth
          />
        </Localized>
        <ValidationMessage meta={meta} />
      </FormField>
    )}
  </Field>
);

export default ConfirmEmailField;
