import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
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
} from "coral-ui/components/v2";

interface Props {
  disabled: boolean;
}

const SetUsernameField: FunctionComponent<Props> = (props) => (
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
            {...input}
            id={input.name}
            placeholder="Username"
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

export default SetUsernameField;
