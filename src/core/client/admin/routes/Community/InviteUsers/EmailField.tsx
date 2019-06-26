import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { validateEmail } from "coral-framework/lib/validation";
import {
  FieldSet,
  FormField,
  InputLabel,
  TextField,
  ValidationMessage,
} from "coral-ui/components";

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
            <InputLabel
              container="legend"
              variant="bodyCopyBold"
              htmlFor={input.name}
            >
              Email Address:
            </InputLabel>
          </Localized>
          <TextField
            name={input.name}
            onChange={input.onChange}
            value={input.value}
            color={
              meta.touched && (meta.error || meta.submitError)
                ? "error"
                : "regular"
            }
            disabled={disabled}
            fullWidth
          />
          {meta.touched && (meta.error || meta.submitError) && (
            <ValidationMessage fullWidth>
              {meta.error || meta.submitError}
            </ValidationMessage>
          )}
        </FormField>
      )}
    </Field>
  </FieldSet>
);

export default EmailField;
