import { Localized } from "fluent-react/compat";
import { identity } from "lodash";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import { FormField, InputLabel, TextField } from "talk-ui/components";

interface Props {
  name: string;
  disabled: boolean;
}

const ClientSecretField: StatelessComponent<Props> = ({ name, disabled }) => (
  <FormField>
    <Localized id="configure-auth-clientSecret">
      <InputLabel>Client Secret</InputLabel>
    </Localized>
    <Field parse={identity} name={name}>
      {({ input }) => (
        <TextField
          name={input.name}
          onChange={input.onChange}
          value={input.value}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      )}
    </Field>
  </FormField>
);

export default ClientSecretField;
