import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import {
  composeValidators,
  required,
  validateEqualPasswords,
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

const SetPasswordField: FunctionComponent<Props> = props => (
  <Field
    name="confirmPassword"
    validate={composeValidators(required, validateEqualPasswords)}
  >
    {({ input, meta }) => (
      <FormField>
        <Localized id="general-confirmPasswordLabel">
          <InputLabel htmlFor={input.name}>Confirm Password</InputLabel>
        </Localized>
        <Localized
          id="general-confirmPasswordTextField"
          attrs={{ placeholder: true }}
        >
          <TextField
            id={input.name}
            name={input.name}
            onChange={input.onChange}
            value={input.value}
            placeholder="Confirm Password"
            type="password"
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
          <ValidationMessage>
            {meta.error || meta.submitError}
          </ValidationMessage>
        )}
      </FormField>
    )}
  </Field>
);

export default SetPasswordField;
