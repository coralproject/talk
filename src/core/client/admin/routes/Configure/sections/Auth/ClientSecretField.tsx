import { Localized } from "fluent-react/compat";
import { identity } from "lodash";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { ValidationMessage } from "coral-framework/lib/form";
import { Validator } from "coral-framework/lib/validation";
import { FormField, InputLabel, PasswordField } from "coral-ui/components";

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
    <Localized id="configure-auth-clientSecret">
      <InputLabel>Client Secret</InputLabel>
    </Localized>
    <Field
      name={name}
      key={(disabled && "on") || "off"}
      parse={identity}
      validate={validate}
    >
      {({ input, meta }) => (
        <>
          <PasswordField
            disabled={disabled || meta.submitting}
            // TODO: (wyattjoh) figure out how to add translations to these props
            hidePasswordTitle="Show Client Secret"
            showPasswordTitle="Hide Client Secret"
            {...input}
          />
          <ValidationMessage meta={meta} />
        </>
      )}
    </Field>
  </FormField>
);

export default ClientSecretField;
