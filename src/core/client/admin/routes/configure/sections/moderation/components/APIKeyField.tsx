import { Localized } from "fluent-react/compat";
import { identity } from "lodash";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import { Validator } from "talk-framework/lib/validation";
import { FormField, InputLabel, TextField } from "talk-ui/components";

import ValidationMessage from "../../../components/ValidationMessage";

interface Props {
  validate?: Validator;
  name: string;
  disabled: boolean;
}

const APIKeyField: StatelessComponent<Props> = ({
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
              API Key
            </InputLabel>
          </Localized>
          <TextField
            id={`configure-moderation-${input.name}`}
            name={input.name}
            onChange={input.onChange}
            value={input.value}
            disabled={disabled}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {meta.touched && (meta.error || meta.submitError) && (
            <ValidationMessage>
              {meta.error || meta.submitError}
            </ValidationMessage>
          )}
        </>
      )}
    </Field>
  </FormField>
);

export default APIKeyField;
