import { Localized } from "@fluent/react/compat";
import { useField, useFormikContext } from "formik";
import React, { FunctionComponent } from "react";

import { streamColorFromMeta } from "coral-framework/lib/form";
import { FormField, InputLabel, TextField } from "coral-ui/components/v2";
import { ValidationMessage } from "coral-ui/components/v3";

import styles from "./UsernameField.css";

const CreateUsernameField: FunctionComponent = () => {
  const [field, meta] = useField("username");
  const { isSubmitting } = useFormikContext();
  return (
    <FormField>
      <Localized id="general-usernameLabel">
        <InputLabel htmlFor={field.name}>Username</InputLabel>
      </Localized>
      <Localized id="general-usernameDescription">
        <div className={styles.description}>You may use “_” and “.”</div>
      </Localized>
      <Localized id="general-usernameTextField" attrs={{ placeholder: true }}>
        <TextField
          {...field}
          id={field.name}
          placeholder="Username"
          color={streamColorFromMeta(meta)}
          disabled={isSubmitting}
          fullWidth
        />
      </Localized>
      <ValidationMessage meta={meta} />
    </FormField>
  );
};

export default CreateUsernameField;
