import { Localized } from "@fluent/react/compat";
import { Field, FieldProps } from "formik";
import React, { FunctionComponent } from "react";

import { streamColorFromMeta } from "coral-framework/lib/form";
import { FormField, InputLabel, TextField } from "coral-ui/components/v2";
import { ValidationMessage } from "coral-ui/components/v3";

interface Props {
  disabled: boolean;
}

const EmailField: FunctionComponent<Props> = (props) => {
  return (
    <Field name="email">
      {({ field, meta }: FieldProps) => (
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
              disabled={props.disabled}
              fullWidth
            />
          </Localized>
          <ValidationMessage meta={meta} />
        </FormField>
      )}
    </Field>
  );
};

export default EmailField;
