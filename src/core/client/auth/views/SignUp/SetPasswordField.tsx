import { Localized } from "@fluent/react/compat";
import { useField, useFormikContext } from "formik";
import React, { FunctionComponent } from "react";

import { streamColorFromMeta } from "coral-framework/lib/form";
import { FormField, InputLabel, PasswordField } from "coral-ui/components/v2";
import { ValidationMessage } from "coral-ui/components/v3";

import styles from "./SetPasswordField.css";

const SetPasswordField: FunctionComponent = () => {
  const [field, meta] = useField("password");
  const { isSubmitting } = useFormikContext();
  return (
    <FormField>
      <Localized id="general-passwordLabel">
        <InputLabel htmlFor={field.name}>Password</InputLabel>
      </Localized>
      <Localized id="general-passwordDescription" $minLength={8}>
        <div className={styles.description}>
          {"Must be at least {$minLength} characters"}
        </div>
      </Localized>
      <Localized id="general-passwordTextField" attrs={{ placeholder: true }}>
        <PasswordField
          {...field}
          id={field.name}
          placeholder="Password"
          color={streamColorFromMeta(meta)}
          disabled={isSubmitting}
          fullWidth
        />
      </Localized>
      <ValidationMessage meta={meta} />
    </FormField>
  );
};

export default SetPasswordField;
