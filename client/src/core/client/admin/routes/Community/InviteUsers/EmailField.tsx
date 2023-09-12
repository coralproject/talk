import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { colorFromMeta, ValidationMessage } from "coral-framework/lib/form";
import { validateEmail } from "coral-framework/lib/validation";
import { FieldSet, FormField, Label, TextField } from "coral-ui/components/v2";

interface Props {
  index: number;
  disabled: boolean;
}

const EmailField: FunctionComponent<Props> = ({ index, disabled }) => (
  <FieldSet>
    <Field name={`emails.${index}`} validate={validateEmail}>
      {({ input, meta }) => (
        <FormField>
          <Localized id="community-invite-emailAddressLabel">
            <Label htmlFor={input.name}>Email Address:</Label>
          </Localized>
          <TextField
            {...input}
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

export default EmailField;
