import { Localized } from "fluent-react/compat";
import { identity } from "lodash";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { colorFromMeta } from "coral-framework/lib/form";
import { Validator } from "coral-framework/lib/validation";
import { FormField, InputLabel, PasswordField } from "coral-ui/components";

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
    <Field name={name} parse={identity} validate={validate}>
      {({ input, meta }) => (
        <>
          <Localized id="configure-moderation-apiKey">
            <InputLabel htmlFor={`configure-moderation-${input.name}`}>
              API key
            </InputLabel>
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
