import {
  composeValidators,
  required,
  validateEqualEmails,
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

const ConfirmEmailField: FunctionComponent<Props> = props => (
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
            id={input.name}
            name={input.name}
            onChange={input.onChange}
            value={input.value}
            placeholder="Confirm Email Address"
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

export default ConfirmEmailField;
