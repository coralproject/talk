import { PasswordField } from "coral-framework/components";
import {
  composeValidators,
  required,
  validatePassword,
} from "coral-framework/lib/validation";
import {
  FormField,
  InputDescription,
  InputLabel,
  ValidationMessage,
} from "coral-ui/components";
import { Localized } from "fluent-react/compat";
import * as React from "react";
import { FunctionComponent } from "react";
import { Field } from "react-final-form";

interface Props {
  disabled: boolean;
}

const SetPasswordField: FunctionComponent<Props> = props => (
  <Field
    name="password"
    validate={composeValidators(required, validatePassword)}
  >
    {({ input, meta }) => (
      <FormField>
        <Localized id="createPassword-passwordLabel">
          <InputLabel htmlFor={input.name}>Password</InputLabel>
        </Localized>
        <Localized id="createPassword-passwordDescription" $minLength={8}>
          <InputDescription>
            {"Must be at least {$minLength} characters"}
          </InputDescription>
        </Localized>
        <Localized
          id="createPassword-passwordTextField"
          attrs={{ placeholder: true }}
        >
          <PasswordField
            id={input.name}
            name={input.name}
            onChange={input.onChange}
            value={input.value}
            placeholder="Password"
            color={
              meta.touched && (meta.error || meta.submitError)
                ? "error"
                : "regular"
            }
            disabled={props.disabled}
            fullWidth
          />
        </Localized>
        {meta.touched && (meta.error || meta.submitError) && (
          <ValidationMessage fullWidth>
            {meta.error || meta.submitError}
          </ValidationMessage>
        )}
      </FormField>
    )}
  </Field>
);

export default SetPasswordField;
