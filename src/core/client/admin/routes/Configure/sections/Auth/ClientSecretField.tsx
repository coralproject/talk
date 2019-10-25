import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { parseEmptyAsNull, ValidationMessage } from "coral-framework/lib/form";
import { Validator } from "coral-framework/lib/validation";
import { FormField, Label, PasswordField } from "coral-ui/components/v2";

interface Props {
  validate?: Validator;
  name: string;
  disabled: boolean;
}

const ClientSecretField: FunctionComponent<Props> = ({
  name,
  disabled,
  validate,
}) => (
  <FormField>
    <Localized id="configure-auth-clientSecret">
      <Label>Client secret</Label>
    </Localized>
    <Field
      name={name}
      key={(disabled && "on") || "off"}
      parse={parseEmptyAsNull}
      validate={validate}
    >
      {({ input, meta }) => (
        <>
          <PasswordField
            disabled={disabled || meta.submitting}
            // TODO: (wyattjoh) figure out how to add translations to these props
            hidePasswordTitle="Show Client Secret"
            showPasswordTitle="Hide Client Secret"
            fullWidth
            {...input}
          />
          <ValidationMessage meta={meta} fullWidth />
        </>
      )}
    </Field>
  </FormField>
);

export default ClientSecretField;
