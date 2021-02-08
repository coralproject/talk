import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useEffect } from "react";
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
  focus?: boolean;
}

const EmailField: FunctionComponent<Props> = (props) => {
  let inputRef: HTMLInputElement | null = null;
  useEffect(() => {
    if (props.focus) {
      // eslint-disable-next-line no-unused-expressions
      inputRef?.focus();
    }
  }, [inputRef, props.focus]);

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
              ref={(field) => {
                if (props.focus) {
                  inputRef = field;
                }
              }}
            />
          </Localized>
          <ValidationMessage meta={meta} />
        </FormField>
      )}
    </Field>
  );
};

export default EmailField;
