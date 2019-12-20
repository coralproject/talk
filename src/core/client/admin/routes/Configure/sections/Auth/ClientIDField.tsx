import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { parseEmptyAsNull } from "coral-framework/lib/form";
import { Validator } from "coral-framework/lib/validation";
import { FormField, Label } from "coral-ui/components/v2";

import TextFieldWithValidation from "../../TextFieldWithValidation";

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
    <Field name={name} parse={parseEmptyAsNull} validate={validate}>
      {({ input, meta }) => (
        <>
          <Localized id="configure-auth-clientID">
            <Label htmlFor={input.name}>Client ID</Label>
          </Localized>
          <TextFieldWithValidation
            {...input}
            id={input.name}
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            meta={meta}
            spellCheck={false}
            fullWidth
          />
        </>
      )}
    </Field>
  </FormField>
);

export default ClientSecretField;
