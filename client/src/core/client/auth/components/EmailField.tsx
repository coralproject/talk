import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { Field } from "react-final-form";

import { streamColorFromMeta } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateEmail,
} from "coral-framework/lib/validation";
import { FormField, InputLabel, TextField } from "coral-ui/components/v2";
import { ValidationMessage } from "coral-ui/components/v3";

interface Props {
  disabled: boolean;
  autofocus?: boolean;
}

const EmailField: FunctionComponent<Props> = (props) => {
  const handleRef = useCallback(
    (ref: HTMLInputElement | null) => {
      if (props.autofocus && ref) {
        ref.focus();
      }
    },
    [props.autofocus]
  );

  return (
    <Field name="email" validate={composeValidators(required, validateEmail)}>
      {({ input, meta }) => (
        <FormField>
          <Localized id="general-emailAddressLabel">
            <InputLabel htmlFor={input.name}>Email Address</InputLabel>
          </Localized>
          <Localized
            id="general-emailAddressTextField"
            attrs={{ placeholder: true }}
          >
            <TextField
              {...input}
              id={input.name}
              placeholder="Email Address"
              type="email"
              color={streamColorFromMeta(meta)}
              disabled={props.disabled}
              fullWidth
              ref={handleRef}
            />
          </Localized>
          <ValidationMessage meta={meta} />
        </FormField>
      )}
    </Field>
  );
};

export default EmailField;
