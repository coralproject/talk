import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { FormField, Label, TextField } from "coral-admin/ui/components";
import { colorFromMeta, parseEmptyAsNull } from "coral-framework/lib/form";
import { Validator } from "coral-framework/lib/validation";

import ValidationMessage from "../../ValidationMessage";

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
    <Localized id="configure-auth-clientID">
      <Label>Client ID</Label>
    </Localized>
    <Field name={name} parse={parseEmptyAsNull} validate={validate}>
      {({ input, meta }) => (
        <>
          <TextField
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            color={colorFromMeta(meta)}
            {...input}
            spellCheck={false}
            fullWidth
          />
          <ValidationMessage meta={meta} />
        </>
      )}
    </Field>
  </FormField>
);

export default ClientSecretField;
