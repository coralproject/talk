import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { streamColorFromMeta } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validateUsername,
} from "coral-framework/lib/validation";
import { FormField, InputLabel, TextField } from "coral-ui/components/v2";
import { ValidationMessage } from "coral-ui/components/v3";

import styles from "./UsernameField.css";

interface Props {
  disabled: boolean;
}

const CreateUsernameField: FunctionComponent<Props> = (props) => (
  <Field
    name="username"
    validate={composeValidators(required, validateUsername)}
  >
    {({ input, meta }) => (
      <FormField>
        <Localized id="general-usernameLabel">
          <InputLabel htmlFor={input.name}>Username</InputLabel>
        </Localized>
        <Localized id="general-usernameDescription">
          <div className={styles.description}>You may use “_” and “.”</div>
        </Localized>
        <Localized id="general-usernameTextField" attrs={{ placeholder: true }}>
          <TextField
            {...input}
            id={input.name}
            placeholder="Username"
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

export default CreateUsernameField;
