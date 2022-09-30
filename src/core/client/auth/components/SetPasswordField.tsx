import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { parseString, streamColorFromMeta } from "coral-framework/lib/form";
import {
  composeValidators,
  required,
  validatePassword,
} from "coral-framework/lib/validation";
import { FormField, InputLabel, PasswordField } from "coral-ui/components/v2";
import { ValidationMessage } from "coral-ui/components/v3";

import styles from "./SetPasswordField.css";

interface Props {
  disabled: boolean;
}

const SetPasswordField: FunctionComponent<Props> = (props) => (
  <Field
    name="password"
    validate={composeValidators(required, validatePassword)}
    parse={parseString}
  >
    {({ input, meta }) => (
      <FormField>
        <Localized id="general-passwordLabel">
          <InputLabel htmlFor={input.name}>Password</InputLabel>
        </Localized>
        <Localized id="general-passwordDescription" vars={{ minLength: 8 }}>
          <div className={styles.description}>
            {"Must be at least {$minLength} characters"}
          </div>
        </Localized>
        <Localized id="general-passwordTextField" attrs={{ placeholder: true }}>
          <PasswordField
            {...input}
            id={input.name}
            placeholder="Password"
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

export default SetPasswordField;
