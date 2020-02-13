import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { colorFromMeta, parseEmptyAsNull } from "coral-framework/lib/form";
import { Validator } from "coral-framework/lib/validation";
import { FormField, Label, PasswordField } from "coral-ui/components/v2";

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
            {...input}
            id={`configure-moderation-${input.name}`}
            disabled={disabled}
            autoComplete="new-password"
            // TODO: (wyattjoh) figure out how to add translations to these props
            hidePasswordTitle="Hide API Key"
            showPasswordTitle="Show API Key"
            color={colorFromMeta(meta)}
            fullWidth
          />

          <ValidationMessage meta={meta} />
        </>
      )}
    </Field>
  </FormField>
);

export default APIKeyField;
