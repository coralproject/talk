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
import { Localized } from "fluent-react/compat";
import * as React from "react";
import { FunctionComponent } from "react";
import { Field } from "react-final-form";

interface Props {
  disabled: boolean;
}

const EmailField: FunctionComponent<Props> = props => (
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
            id={input.name}
            name={input.name}
            onChange={input.onChange}
            value={input.value}
            placeholder="Email Address"
            type="email"
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
