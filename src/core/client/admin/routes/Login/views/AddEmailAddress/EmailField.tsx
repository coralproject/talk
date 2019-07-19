import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  composeValidators,
  required,
  validateEmail,
} from "coral-framework/lib/validation";
import {
  FormField,
  InputLabel,
  TextField,
  ValidationMessage,
} from "coral-ui/components";

interface Props {
  disabled: boolean;
}

const EmailField: FunctionComponent<Props> = props => (
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
            id={input.name}
            name={input.name}
            onChange={input.onChange}
            value={input.value}
            placeholder="Email Address"
            color={
              meta.touched && (meta.error || meta.submitError)
                ? "error"
                : "regular"
            }
            disabled={props.disabled}
            fullWidth
          />
        </Localized>
        {meta.touched && (meta.error || meta.submitError) && (
          <ValidationMessage fullWidth>
            {meta.error || meta.submitError}
          </ValidationMessage>
        )}
      </FormField>
    )}
  </Field>
);

export default EmailField;
