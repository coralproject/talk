import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { Field } from "react-final-form";
import {
  composeValidators,
  required,
  validateEqualEmails,
} from "talk-framework/lib/validation";
import {
  FormField,
  InputLabel,
  TextField,
  ValidationMessage,
} from "talk-ui/components";

interface Props {
  disabled: boolean;
}

const ConfirmEmailField: StatelessComponent<Props> = props => (
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
