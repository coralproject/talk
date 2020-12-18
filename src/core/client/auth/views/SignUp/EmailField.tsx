import { Localized } from "@fluent/react/compat";
import { useField, useFormikContext } from "formik";
import React, { FunctionComponent } from "react";

import { streamColorFromMeta } from "coral-framework/lib/form";
import { FormField, InputLabel, TextField } from "coral-ui/components/v2";
import { ValidationMessage } from "coral-ui/components/v3";

const EmailField: FunctionComponent = () => {
  const [field, meta] = useField("email");
  const { isSubmitting } = useFormikContext();
  return (
    <FormField>
      <Localized id="general-emailAddressLabel">
        <InputLabel htmlFor={field.name}>Email Address</InputLabel>
      </Localized>
      <Localized
        id="general-emailAddressTextField"
        attrs={{ placeholder: true }}
      >
        <TextField
          {...field}
          id={field.name}
          placeholder="Email Address"
          type="email"
          color={streamColorFromMeta(meta)}
          disabled={isSubmitting}
          fullWidth
        />
      </Localized>
      <ValidationMessage meta={meta} />
    </FormField>
  );
};

export default EmailField;
