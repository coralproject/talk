import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { FormField, Label, PasswordField } from "coral-admin/ui/components";
import { colorFromMeta, parseEmptyAsNull } from "coral-framework/lib/form";
import { Validator } from "coral-framework/lib/validation";

import ValidationMessage from "../../ValidationMessage";

interface Props {
  validate?: Validator;
  name: string;
  disabled: boolean;
}

const APIKeyField: FunctionComponent<Props> = ({
  name,
  disabled,
  validate,
}) => (
  <FormField>
    <Field name={name} parse={parseEmptyAsNull} validate={validate}>
      {({ input, meta }) => (
        <>
          <Localized id="configure-moderation-apiKey">
            <Label htmlFor={`configure-moderation-${input.name}`}>
              API key
            </Label>
          </Localized>
          <PasswordField
            id={`configure-moderation-${input.name}`}
            disabled={disabled}
            // TODO: (wyattjoh) figure out how to add translations to these props
            hidePasswordTitle="Show API Key"
            showPasswordTitle="Hide API Key"
            color={colorFromMeta(meta)}
            fullWidth
            {...input}
          />

          <ValidationMessage meta={meta} />
        </>
      )}
    </Field>
  </FormField>
);

export default APIKeyField;
