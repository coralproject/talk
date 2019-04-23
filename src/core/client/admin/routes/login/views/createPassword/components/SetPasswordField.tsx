import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { Field } from "react-final-form";
import { PasswordField } from "talk-framework/components";
import {
  composeValidators,
  required,
  validatePassword,
} from "talk-framework/lib/validation";
import {
  FormField,
  InputDescription,
  InputLabel,
  ValidationMessage,
} from "talk-ui/components";

interface Props {
  disabled: boolean;
}

const SetPasswordField: StatelessComponent<Props> = props => (
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
