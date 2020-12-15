import { Localized } from "@fluent/react/compat";
import { Field, FieldProps } from "formik";
import React, { FunctionComponent } from "react";

import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import { validateEmail } from "coral-framework/lib/validation";
import { FieldSet, FormField, Label, TextField } from "coral-ui/components/v2";

interface Props {
  index: number;
  disabled: boolean;
}

const EmailField: FunctionComponent<Props> = ({ index, disabled }) => {
  return (
    <FieldSet>
      <Field name={`emails[${index}]`} validate={validateEmail}>
        {({ field, meta }: FieldProps) => (
          <FormField>
            <Localized id="community-invite-emailAddressLabel">
              <Label htmlFor={field.name}>Email Address:</Label>
            </Localized>
            <TextField
              {...field}
              data-testid={`invite-users-email.${index}`}
              color={colorFromMeta(meta)}
              disabled={disabled}
              fullWidth
            />
            <ValidationMessage meta={meta} fullWidth />
          </FormField>
        )}
      </Field>
    </FieldSet>
  );
};

export default EmailField;
