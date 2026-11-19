import React, { FunctionComponent, ReactNode } from "react";
import { Field } from "react-final-form";

import { parseEmptyAsNull } from "coral-framework/lib/form";
import { Validator } from "coral-framework/lib/validation";
import { FormField, Label } from "coral-ui/components/v2";

import TextFieldWithValidation from "../../TextFieldWithValidation";

interface Props {
  validate?: Validator;
  name: string;
  disabled: boolean;
  label: ReactNode;
  description?: ReactNode;
}

const LabeledTextField: FunctionComponent<Props> = ({
  name,
  disabled,
  validate,
  label,
  description,
}) => (
  <FormField>
    <Field name={name} parse={parseEmptyAsNull} validate={validate}>
      {({ input, meta }) => (
        <>
          <Label htmlFor={input.name}>{label}</Label>
          {description}
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

export default LabeledTextField;
