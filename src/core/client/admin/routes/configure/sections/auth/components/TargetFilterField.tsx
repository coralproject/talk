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
      <Field name={`${name}.admin`} type="checkbox" parse={bool}>
        {({ input, meta }) => (
          <Localized id="configure-auth-targetFilterTalkAdmin">
            <CheckBox
              id={input.name}
              name={input.name}
              onChange={input.onChange}
              checked={!!input.value}
              disabled={disabled}
            >
              Talk Admin
            </CheckBox>
          </Localized>
        )}
      </Field>
      <Field name={`${name}.stream`} type="checkbox" parse={bool}>
        {({ input }) => (
          <Localized id="configure-auth-targetFilterCommentStream">
            <CheckBox
              id={input.name}
              name={input.name}
              onChange={input.onChange}
              checked={!!input.value}
              disabled={disabled}
            >
              Comment Stream
            </CheckBox>
          </Localized>
        )}
      </Field>
    </Flex>
  </FormField>
);

export default TargetFilterField;
