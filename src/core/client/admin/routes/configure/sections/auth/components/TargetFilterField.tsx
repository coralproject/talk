import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";
import { Field } from "react-final-form";

import { CheckBox, Flex, FormField, InputLabel } from "talk-ui/components";

const bool = (v: any) => !!v;

interface Props {
  label: React.ReactNode;
  name: string;
  disabled: boolean;
}

const TargetFilterField: StatelessComponent<Props> = ({
  name,
  label,
  disabled,
}) => (
  <FormField>
    <InputLabel>{label}</InputLabel>
    <Flex direction="row" itemGutter="double">
      <FormField>
        <Field name={`${name}.admin`} type="checkbox" parse={bool}>
          {({ input, meta }) => (
            <Localized id="configure-auth-targetFilterAdmin">
              <CheckBox
                name={input.name}
                onChange={input.onChange}
                checked={!!input.value}
                disabled={disabled}
              >
                Admin
              </CheckBox>
            </Localized>
          )}
        </Field>
      </FormField>
      <FormField>
        <Field name={`${name}.stream`} type="checkbox" parse={bool}>
          {({ input }) => (
            <Localized id="configure-auth-targetFilterEmbedStream">
              <CheckBox
                name={input.name}
                onChange={input.onChange}
                checked={!!input.value}
                disabled={disabled}
              >
                Embed Stream
              </CheckBox>
            </Localized>
          )}
        </Field>
      </FormField>
    </Flex>
  </FormField>
);

export default TargetFilterField;
