import {
  composeValidators,
  required,
  validateUsername,
} from "coral-framework/lib/validation";
import {
  FormField,
  InputDescription,
  InputLabel,
  TextField,
  ValidationMessage,
} from "coral-ui/components";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

interface Props {
  disabled: boolean;
}

const SetUsernameField: FunctionComponent<Props> = props => (
  <Field
    name="username"
    validate={composeValidators(required, validateUsername)}
  >
    {({ input, meta }) => (
      <FormField>
        <Localized id="invite-usernameLabel">
          <InputLabel htmlFor={input.name}>Username</InputLabel>
        </Localized>
        <Localized id="invite-usernameDescription">
          <InputDescription>You may use “_” and “.”</InputDescription>
        </Localized>
        <Localized id="invite-usernameTextField" attrs={{ placeholder: true }}>
          <TextField
            id={input.name}
            name={input.name}
            onChange={input.onChange}
            value={input.value}
            placeholder="Username"
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

export default SetUsernameField;
